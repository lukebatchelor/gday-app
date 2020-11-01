import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  InputAdornment,
  makeStyles,
  TextField,
  Toolbar,
  Typography,
} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import CreateIcon from '@material-ui/icons/Create';
import SearchIcon from '@material-ui/icons/Search';
import { useForm, Controller } from 'react-hook-form';
import { Compose } from './Compose';
import { createConversation, getAllUsers, getMessages, sendMessage } from '../api';
import { useNavigate } from '@reach/router';
import { ChatBubble } from './ChatBubble';
import { useStateIfMounted } from 'use-state-if-mounted';
const useStyles = makeStyles((theme) => ({
  composeButton: {
    marginLeft: 'auto',
  },
}));

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

  const { handleSubmit, control, watch, setValue } = useForm<FormValues>({ defaultValues });
  const chatContent = watch('chat');
  const [allUsers, setAllUsers] = useState<Array<IUser>>([]);
  const [messages, setMessages] = useStateIfMounted<Array<IMessage>>([]);
  const [lastTimeStamp, setLastTimeStamp] = useState<number>(0);
  const userMap = useMemo(() => {
    const map: Record<string, IUser> = {};
    allUsers.forEach((user) => {
      map[user.id] = user;
    });
    return map;
  }, [allUsers]);
  console.log('userMap', userMap);

  const onChatSubmit = async (data: FormValues) => {
    console.log('chat submit', data);
    if (isComposing) {
      const res = await createConversation(composeUsersRef.current);
      console.log(res);
      if (res.conversation && res.conversation.id) {
        navigate(`/${res.conversation.id}`);
      }
    } else {
      if (conversationId && chatContent) {
        const res = await sendMessage(conversationId, chatContent);
        if (res.conversation && res.conversation.lastMessage && res.conversation.lastMessage.timestamp) {
          setLastTimeStamp(res.conversation.lastMessage.timestamp);
        }
        setValue('chat', '', { shouldDirty: false });
        console.log(res);
      }
    }
  };
  const onComposeUserChange = (newUsers: Array<IUser>) => {
    composeUsersRef.current = newUsers;
  };

  useEffect(() => {
    let isMounted = true;
    if (!isComposing && conversationId) {
      getMessages(conversationId).then((res) => {
        if (isMounted) setMessages(res.messages);
      });
    }

    return () => {
      isMounted = false;
    };
  }, [isComposing, conversationId, lastTimeStamp]);

  useEffect(() => {
    let mounted = true;
    getAllUsers().then((res) => {
      if (mounted) setAllUsers(res.users);
    });
    return () => {
      mounted = false;
    };
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
            {messages.map((message: IMessage, idx: number) => (
              <ChatBubble
                key={`message-${idx}`}
                message={message}
                prevAuthor={idx === 0 ? '' : messages[idx - 1].sendingUser}
                author={userMap[message.sendingUser]}
              />
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
