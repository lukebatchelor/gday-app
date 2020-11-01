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
import type { MobileView } from '../types';

const useStyles = makeStyles((theme) => ({
  spacer: {
    marginTop: theme.spacing(8),
  },
}));

type HomeProps = RouteComponentProps;
export function HomePage(props: HomeProps) {
  const classes = useStyles();
  const theme = useTheme();

  // Current view we are in (only for mobile)
  const [curMobileView, setCurMobileView] = useState<MobileView>('Chats');
  const [isComposing, setIsComposing] = useState<boolean>(false);

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const onComposeClicked = () => {
    console.log('compose');
    setIsComposing(true);
    setCurMobileView('Conversation');
  };

  return (
    <Box>
      <CssBaseline />
      <AppHeader isMobile={isMobile} isComposing={isComposing} onCompose={onComposeClicked} chatName="Group chat" />
      <Box className={classes.spacer} />
      <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} height="calc(100vh - 64px)">
        {!isMobile || curMobileView === 'Chats' ? <ChatsView isMobile={isMobile} /> : null}
        {!isMobile || curMobileView === 'Conversation' ? (
          <ConversationView isMobile={isMobile} isComposing={isComposing} />
        ) : null}
      </Box>
    </Box>
  );
}
