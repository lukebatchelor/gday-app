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
import { AppHeader } from '../components/AppHeader';

const useStyles = makeStyles((theme) => ({
  spacer: {
    marginTop: theme.spacing(8),
  },
}));

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
        <AppHeader isMobile={true} />
        <Box className={classes.spacer} />
        <ChatsView isMobile={true} />
      </Box>
    );
  }

  return (
    <Box>
      <CssBaseline />
      <AppHeader isMobile={false} />
      <Box className={classes.spacer} />
      <Box display="flex">
        <ChatsView isMobile={false} />
        <ConversationView isMobile={false} />
      </Box>
    </Box>
  );
}
