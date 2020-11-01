import React, { useContext } from 'react';
import { Avatar, Box, makeStyles } from '@material-ui/core';
import { UserContext } from '../contexts/UserContext';

const useStyles = makeStyles((theme) => ({}));

type ChatBubbleProps = {
  message: IMessage;
  author: IUser;
  prevAuthor: string;
};
export function ChatBubble(props: ChatBubbleProps) {
  const classes = useStyles();
  const { message, author, prevAuthor } = props;
  const [user] = useContext(UserContext);

  if (!message || !author) return null;

  const displayName = author.displayName;
  const avatarUrl = author.avatarUrl;
  const timeStr = new Date(message.timestamp).toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric' });
  const { content } = message;

  if (user.id !== author.id) {
    return (
      <Box>
        {!prevAuthor || prevAuthor !== author.id ? <Avatar src={avatarUrl} /> : null}
        {displayName}: {content} @ {timeStr}
      </Box>
    );
  }
  return (
    <Box ml="auto">
      {displayName}: {content} @ {timeStr}
    </Box>
  );
}
