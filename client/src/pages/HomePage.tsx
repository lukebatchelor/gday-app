import React, { useEffect, useState } from 'react';
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
import { ProfileDialog } from '../components/ProfileDialog';

const useStyles = makeStyles((theme) => ({
  spacer: {
    marginTop: theme.spacing(8),
  },
}));

type HomeProps = RouteComponentProps & { conversationId?: string };
export function HomePage(props: HomeProps) {
  const { conversationId } = props;
  const classes = useStyles();
  const theme = useTheme();

  // Current view we are in (only for mobile)
  const [curMobileView, setCurMobileView] = useState<MobileView>('Chats');
  const [isComposing, setIsComposing] = useState<boolean>(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState<IUser>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const onComposeClicked = () => {
    setIsComposing(true);
    setCurMobileView('Conversation');
  };
  const onComposeClose = () => {
    setIsComposing(false);
    setCurMobileView('Chats');
  };

  useEffect(() => {
    (async () => {
      if (isMobile && conversationId) {
        setCurMobileView('Conversation');
      }
    })();
  }, [isMobile, conversationId]);

  const openProfileDialog = (user: IUser) => {
    setProfileDialogOpen(user);
  };
  const closeProfileDialog = () => setProfileDialogOpen(null);

  if (isMobile)
    return (
      <Box>
        <CssBaseline />
        <AppHeader
          isMobile={true}
          isComposing={isComposing}
          onComposeClose={onComposeClose}
          onCompose={onComposeClicked}
          selectedConversationId={conversationId}
          onOpenProfileDialog={openProfileDialog}
        />
        <Box className={classes.spacer} />
        <Box display="flex" flexDirection="column" height="calc(100vh - 64px)">
          {curMobileView === 'Chats' && !conversationId ? <ChatsView isMobile={true} /> : null}
          {curMobileView === 'Conversation' ? (
            <ConversationView isMobile={true} isComposing={isComposing} conversationId={conversationId} />
          ) : null}
        </Box>
        <ProfileDialog isOpen={!!profileDialogOpen} handleClose={closeProfileDialog} profileUser={profileDialogOpen} />
      </Box>
    );

  return (
    <Box>
      <CssBaseline />
      <AppHeader
        isMobile={false}
        isComposing={isComposing}
        onCompose={onComposeClicked}
        selectedConversationId={conversationId}
        onOpenProfileDialog={openProfileDialog}
      />
      <Box className={classes.spacer} />
      <Box display="flex" flexDirection="row" height="calc(100vh - 64px)">
        <ChatsView isMobile={false} />
        <ConversationView isMobile={false} isComposing={isComposing} conversationId={conversationId} />
      </Box>
      <ProfileDialog isOpen={!!profileDialogOpen} handleClose={closeProfileDialog} profileUser={profileDialogOpen} />
    </Box>
  );
}
