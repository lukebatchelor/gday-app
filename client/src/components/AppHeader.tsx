import { AppBar, Avatar, Box, IconButton, makeStyles, Toolbar, Typography } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Link, useNavigate } from '@reach/router';
import React, { useContext, useEffect, useState } from 'react';
import { getConversationDetails } from '../api';
import { UserContext } from '../contexts/UserContext';

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
  onOpenProfileDialog?: () => void;
  isComposing: boolean;
  selectedConversationId?: string;
};
export function AppHeader(props: AppHeaderProps) {
  const classes = useStyles();
  const { isMobile, onCompose, isComposing, selectedConversationId, onOpenProfileDialog } = props;
  const [user] = useContext(UserContext);
  const [chatName, setChatName] = useState('Group chat');
  const [conversationAvatarUrl, setConversationAvatarUrl] = useState('/404');
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedConversationId) {
      console.log('No selected conversation');
      return;
    }
    getConversationDetails(selectedConversationId).then((res) => {
      setChatName(res.conversation.name);
      setConversationAvatarUrl(res.conversation.avatarUrl);
    });
  }, [selectedConversationId]);

  if (isMobile)
    return (
      <AppBar style={{ flexDirection: 'column' }}>
        <Box width="auto">
          <Toolbar>
            {(isComposing || selectedConversationId) && (
              <IconButton onClick={() => navigate(!isComposing ? '..' : '/')}>
                <ArrowBackIcon />
              </IconButton>
            )}

            <IconButton onClick={onOpenProfileDialog}>
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
      </AppBar>
    );

  return (
    <AppBar style={{ flexDirection: 'row' }}>
      <Box width="35vw">
        <Toolbar>
          <IconButton onClick={onOpenProfileDialog}>
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
      <Toolbar>
        <Avatar src={conversationAvatarUrl}></Avatar>
        <Box mr={2} />
        <Typography variant="h5">{isComposing ? 'Create new chat' : chatName}</Typography>
      </Toolbar>
    </AppBar>
  );
}
