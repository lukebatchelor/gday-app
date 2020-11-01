import { Avatar, Box, InputAdornment, makeStyles, TextField, Typography } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { Link } from '@reach/router';
import React, { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useStateIfMounted } from 'use-state-if-mounted';
import { getAllUsers, getConversations } from '../api';

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
  const [conversations, setConversations] = useStateIfMounted<Array<IConversation>>([]);
  const [allUsers, setAllUsers] = useStateIfMounted<Array<IUser>>([]);
  const userMap = useMemo(() => {
    const map: Record<string, IUser> = {};
    allUsers.forEach((user) => {
      map[user.id] = user;
    });
    return map;
  }, [allUsers]);

  const onSearchSubmit = (data: FormValues) => {
    const { search } = data;
    console.log('Searched for: ', search);
  };

  useEffect(() => {
    getConversations().then((res) => {
      setConversations(res.conversations);
    });
  }, []);

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
          {conversations.map((c, i) => (
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
                      <Typography className={classes.messageTimeStamp}>
                        {!c.lastMessage
                          ? '?? '
                          : new Date(c.lastMessage.timestamp).toLocaleTimeString('en-GB', {
                              hour: 'numeric',
                              minute: 'numeric',
                            })}
                      </Typography>
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
