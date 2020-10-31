import React, { useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Container,
  CssBaseline,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { RouteComponentProps } from '@reach/router';
import { ChatsView } from '../components/ChatsView';
import { ConversationView } from '../components/ConversationView';

const useStyles = makeStyles((theme) => ({}));

type View = 'Chats' | 'Conversation';

type HomeProps = RouteComponentProps;
export function HomePage(props: HomeProps) {
  const classes = useStyles();
  const theme = useTheme();

  const [curView, setCurView] = useState<View>('Chats');

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (isMobile) {
    return (
      <Box>
        <CssBaseline />
        <ChatsView isMobile={true} />
      </Box>
    );
  }

  console.log(isMobile);

  return (
    <Box>
      <CssBaseline />
      <Box display="flex">
        <ChatsView isMobile={isMobile} />
        <ConversationView isMobile={isMobile} />
      </Box>
    </Box>
  );
}
