import { Box, makeStyles, TextField } from '@material-ui/core';
import { useNavigate } from '@reach/router';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useStateIfMounted } from 'use-state-if-mounted';
import { createConversation, getAllUsers, getMessages, sendMessage } from '../api';
import { ConversationCacheContext } from '../contexts/ConversationCacheContext';
import { ChatBubble } from './ChatBubble';
import { Compose } from './Compose';
const useStyles = makeStyles((theme) => ({
  composeButton: {
    marginLeft: 'auto',
  },
}));

type MessageGroup = {
  author: IUser;
  messages: Array<IMessage>;
};
type FormValues = { chat: string };
const defaultValues: FormValues = { chat: '' };

type ConversationViewProps = {
  isMobile: boolean;
  isComposing: boolean;
  conversationId?: string;
};
export function ConversationView(props: ConversationViewProps) {
  const { isComposing, conversationId } = props;
  const classes = useStyles();
  const navigate = useNavigate();
  const composeUsersRef = useRef<Array<IUser>>([]);
  const { state: conversationCacheContext, dispatch } = useContext(ConversationCacheContext);

  const { handleSubmit, control, watch, setValue } = useForm<FormValues>({ defaultValues });
  const chatContent = watch('chat');
  const [allUsers, setAllUsers] = useStateIfMounted<Array<IUser>>([]);
  // const [messages, setMessages] = useStateIfMounted<Array<IMessage>>([]);
  const messages = conversationCacheContext.messages[conversationId] || [];
  const [lastTimeStamp, setLastTimeStamp] = useState<number>(0);
  const userMap = useMemo(() => {
    const map: Record<string, IUser> = {};
    allUsers.forEach((user) => {
      map[user.id] = user;
    });
    return map;
  }, [allUsers]);

  const onChatSubmit = async (data: FormValues) => {
    if (isComposing) {
      const res = await createConversation(composeUsersRef.current);
      if (res.conversation && res.conversation.id) {
        navigate(`/${res.conversation.id}`);
      }
    } else {
      if (conversationId && chatContent) {
        const res = await sendMessage(conversationId, chatContent);
        setValue('chat', '', { shouldDirty: false });
      }
    }
  };
  const onComposeUserChange = (newUsers: Array<IUser>) => {
    composeUsersRef.current = newUsers;
  };

  useEffect(() => {
    if (!isComposing && conversationId) {
      if (messages.length === 0) {
        getMessages(conversationId).then((res) => {
          if (messages.length === 0) {
            dispatch({ type: 'ADD_MESSAGES', conversationId, messages: res.messages });
          }
        });
      }
    }
  }, [isComposing, conversationId, conversationCacheContext]);

  useEffect(() => {
    getAllUsers().then((res) => {
      setAllUsers(res.users);
    });
  }, []);

  const messageGroups: MessageGroup[] = messages.reduce((groups: MessageGroup[], next: IMessage) => {
    const nextAuthor = userMap[next.sendingUser];
    if (!nextAuthor) return groups;
    if (groups.length === 0) return [{ author: nextAuthor, messages: [next] }];
    if (next.sendingUser === groups[groups.length - 1].author.id) {
      groups[groups.length - 1].messages.push(next);
      return groups;
    }
    groups.push({ author: userMap[next.sendingUser], messages: [next] });
    return groups;
  }, []);

  return (
    <Box flexGrow={1} display="flex" flexDirection="column" p={2}>
      <Box flexGrow={1}>
        {isComposing && (
          <Box>
            <Compose onComposeUserChange={onComposeUserChange} allUsers={allUsers} />
          </Box>
        )}
        {!isComposing && (
          <Box display="flex" flexDirection="column">
            {messageGroups.map((messageGroup: MessageGroup, idx: number) => (
              <ChatBubble key={`message-${idx}`} messageGroup={messageGroup} />
            ))}
          </Box>
        )}
      </Box>
      <Box>
        <form noValidate onSubmit={handleSubmit(onChatSubmit)}>
          <Controller
            control={control}
            name="chat"
            render={({ onChange, onBlur, value }) => (
              <TextField
                placeholder="Type a message..."
                variant="outlined"
                size="medium"
                fullWidth
                onChange={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}
          />
        </form>
      </Box>
    </Box>
  );
}
