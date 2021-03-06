import { Avatar, Box, InputAdornment, makeStyles, TextField, Tooltip, Typography } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { Link } from '@reach/router';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useStateIfMounted } from 'use-state-if-mounted';
import { getAllUsers, getConversations } from '../api';
import { ConversationCacheContext } from '../contexts/ConversationCacheContext';

const useStyles = makeStyles((theme) => ({
  messageText: {
    flexGrow: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'pre',
  },
  messageTimeStamp: {
    // marginLeft: 'auto',
  },
}));

function conversationMatchSearch(conversation: IConversation, searchStr: string) {
  if (!searchStr) return true;
  if (conversation.name.includes(searchStr)) return true;
  if (conversation.lastMessage) {
    return (
      conversation.lastMessage.content.includes(searchStr) || conversation.lastMessage.sendingUser.includes(searchStr)
    );
  }
  return false;
}

type FormValues = { search: string };
const defaultValues = { search: '' };

// const conversations = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 12, 3, 4, 5, 6, 7, 8, 9];

type ChatsViewProps = {
  isMobile: boolean;
};
export function ChatsView(props: ChatsViewProps) {
  const { isMobile } = props;
  const classes = useStyles();
  const { handleSubmit, control } = useForm<FormValues>({ defaultValues });
  const [filteredConversations, setFilteredConversations] = useState<Array<IConversation>>([]);
  // const [conversations, setConversations] = useStateIfMounted<Array<IConversation>>([]);
  const [allUsers, setAllUsers] = useStateIfMounted<Array<IUser>>([]);
  const [searchStr, setSearchStr] = useStateIfMounted<string>('');
  const { state, dispatch } = useContext(ConversationCacheContext);
  const conversations = Object.values(state.conversations);
  const userMap = useMemo(() => {
    const map: Record<string, IUser> = {};
    allUsers.forEach((user) => {
      map[user.id] = user;
    });
    return map;
  }, [allUsers]);

  const onSearchSubmit = (data: FormValues) => {
    const { search } = data;
    setFilteredConversations(conversations.filter((c) => conversationMatchSearch(c, search)));
    setSearchStr(search);
  };

  useEffect(() => {
    if (conversations.length === 0) {
      getConversations().then((res) => {
        setFilteredConversations(res.conversations.filter((c) => conversationMatchSearch(c, searchStr)));
        if (conversations.length === 0) {
          dispatch({ type: 'SET_CONVERSATIONS', conversations: res.conversations });
        }
      });
    } else {
      setFilteredConversations(conversations.filter((c) => conversationMatchSearch(c, searchStr)));
    }
  }, [state.conversations]);

  useEffect(() => {
    getAllUsers().then((res) => {
      setAllUsers(res.users);
    });
  }, []);

  return (
    <Box>
      {/* <Box className={classes.spacer} /> */}
      <Box
        p={2}
        overflow="scroll"
        width={isMobile ? 'auto' : '35vw'}
        height="calc(100vh - 64px)"
        borderRight={isMobile ? '0px' : '2px solid #eee'}
      >
        <form noValidate onSubmit={handleSubmit(onSearchSubmit)}>
          <Controller
            control={control}
            name="search"
            render={({ onChange, onBlur, value }) => (
              <TextField
                label="Seach"
                variant="outlined"
                size="medium"
                fullWidth
                margin="normal"
                onChange={onChange}
                onBlur={onBlur}
                value={value}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </form>

        <Box mt={2} display="flex" flexDirection="column">
          {filteredConversations.map((c, i) => (
            <Box key={`${c}-${i}`} display="flex" marginY={1} alignItems="center">
              <Link to={`/${c.id}`}>
                <Avatar src={c.avatarUrl}></Avatar>
              </Link>
              <Box ml={2} display="flex" flexDirection="column" style={{ flex: '1', minWidth: 0 }}>
                <Typography>{c.name}</Typography>
                <Box display="flex">
                  {c.lastMessage && (
                    <>
                      <Typography className={classes.messageText}>
                        {!c.lastMessage
                          ? 'None '
                          : userMap[c.lastMessage.sendingUser] && userMap[c.lastMessage.sendingUser].displayName}
                        : {!c.lastMessage ? 'None ' : c.lastMessage.content}
                      </Typography>
                      <Tooltip
                        title={new Date(c.lastMessage.timestamp).toLocaleString()}
                        aria-label="date-sent"
                        placement="right"
                      >
                        <Typography className={classes.messageTimeStamp}>
                          {!c.lastMessage
                            ? '?? '
                            : new Date(c.lastMessage.timestamp).toLocaleTimeString('en-GB', {
                                hour: 'numeric',
                                minute: 'numeric',
                              })}
                        </Typography>
                      </Tooltip>
                    </>
                  )}
                  {!c.lastMessage && <Typography className={classes.messageText}>Empty</Typography>}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
