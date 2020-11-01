import React, { useContext } from 'react';
import { Avatar, Box, makeStyles, Paper, Typography } from '@material-ui/core';
import { UserContext } from '../contexts/UserContext';

const useStyles = makeStyles((theme) => ({
  userMessageBox: {
    marginTop: theme.spacing(1),
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
  },
  otherMessageBox: {
    marginTop: theme.spacing(1),
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
  },
}));

type ChatBubbleProps = {
  messageGroup: {
    author: IUser;
    messages: Array<IMessage>;
  };
};
export function ChatBubble(props: ChatBubbleProps) {
  const classes = useStyles();
  const { messageGroup } = props;
  const [user] = useContext(UserContext);

  if (!messageGroup || !messageGroup.author) return null;

  const { author, messages } = messageGroup;
  const displayName = author.displayName;
  const avatarUrl = author.avatarUrl;
  // const timeStr = new Date(message.timestamp).toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric' });

  if (user.id !== author.id) {
    return (
      <Box display="flex" alignItems="flex-end">
        <Avatar src={avatarUrl} />
        <Box mr={2} />
        <Box>
          <Typography variant="body1" style={{ marginBottom: '-8px' }}>
            {displayName}
          </Typography>
          {messages.map((message, idx) => (
            <Paper key={idx} className={classes.userMessageBox}>
              <Typography>{message.content}</Typography>
            </Paper>
          ))}
        </Box>
      </Box>
    );
  }
  return (
    <Box ml="auto">
      {messages.map((message, idx) => (
        <Paper key={idx} className={classes.userMessageBox}>
          <Typography>{message.content}</Typography>
        </Paper>
      ))}
    </Box>
  );
}
