import { AppBar, Avatar, Box, IconButton, makeStyles, Toolbar, Typography } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import InfoIcon from '@material-ui/icons/Info';
import { Link, useNavigate } from '@reach/router';
import React, { useContext, useEffect, useState } from 'react';
import { getConversationDetails } from '../api';
import { UserContext } from '../contexts/UserContext';
import { ConversationCacheContext } from '../contexts/ConversationCacheContext';

const useStyles = makeStyles((theme) => ({
  composeButton: {
    marginLeft: 'auto',
  },
  spacer: {
    marginTop: theme.spacing(8),
  },
}));

type AppHeaderProps = {
  isMobile: boolean;
  onCompose: () => void;
  onOpenProfileDialog?: (user: IUser) => void;
  onConversationInfoOpen?: () => void;
  isComposing: boolean;
  onComposeClose?: () => void;
  selectedConversationId?: string;
};
export function AppHeader(props: AppHeaderProps) {
  const classes = useStyles();
  const {
    isMobile,
    onCompose,
    isComposing,
    onComposeClose,
    selectedConversationId,
    onOpenProfileDialog,
    onConversationInfoOpen,
  } = props;
  const [user] = useContext(UserContext);
  const { state } = useContext(ConversationCacheContext);
  const navigate = useNavigate();

  const conversation = state.conversations[selectedConversationId];
  // avatar will either be blank (when creating new message), the conversationAvatar (when in a conversation)
  // or the user avatar (when in conversation view for getting to profile view)
  const avatarUrl = isComposing ? '' : conversation ? conversation.avatarUrl : user.avatarUrl;
  const title = isComposing ? 'New Message' : conversation ? conversation.name : 'Chats';

  if (isMobile) {
    const onBackClick = () => {
      if (isComposing) onComposeClose();
      else navigate('..');
    };
    return (
      <AppBar style={{ flexDirection: 'column' }}>
        <Box width="auto">
          <Toolbar>
            {(isComposing || selectedConversationId) && (
              <IconButton onClick={onBackClick}>
                <ArrowBackIcon />
              </IconButton>
            )}

            <IconButton onClick={() => onOpenProfileDialog(user)}>
              <Avatar src={avatarUrl}></Avatar>
            </IconButton>
            <Box mr={2} />
            <Typography variant="h5">{title}</Typography>
            {!isComposing && !selectedConversationId && (
              <IconButton
                aria-label="Compose new message"
                onClick={onCompose}
                color="inherit"
                size="small"
                className={classes.composeButton}
              >
                <CreateIcon fontSize="small" />
              </IconButton>
            )}
            {selectedConversationId && (
              <IconButton
                aria-label="Conversation info"
                onClick={onConversationInfoOpen}
                color="inherit"
                size="small"
                className={classes.composeButton}
              >
                <InfoIcon />
              </IconButton>
            )}
          </Toolbar>
        </Box>
      </AppBar>
    );
  }

  return (
    <AppBar style={{ flexDirection: 'row' }}>
      <Box width="35vw">
        <Toolbar>
          <IconButton onClick={() => onOpenProfileDialog(user)}>
            <Avatar src={user.avatarUrl}></Avatar>
          </IconButton>
          <Box mr={2} />
          <Typography variant="h5">Chats</Typography>
          <IconButton
            aria-label="Compose new message"
            onClick={onCompose}
            color="inherit"
            size="small"
            className={classes.composeButton}
          >
            <CreateIcon fontSize="small" />
          </IconButton>
        </Toolbar>
      </Box>
      <Box width="65vw">
        <Toolbar>
          <Avatar src={avatarUrl}></Avatar>
          <Box mr={2} />
          <Typography variant="h5">{isComposing ? 'Create new chat' : title}</Typography>
          {selectedConversationId && (
            <IconButton
              aria-label="Conversation info"
              onClick={onConversationInfoOpen}
              color="inherit"
              size="small"
              className={classes.composeButton}
            >
              <InfoIcon />
            </IconButton>
          )}
        </Toolbar>
      </Box>
    </AppBar>
  );
}
