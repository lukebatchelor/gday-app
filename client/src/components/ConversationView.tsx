import React from 'react';
import { AppBar, Avatar, Box, IconButton, makeStyles, Toolbar, Typography } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import CreateIcon from '@material-ui/icons/Create';
import SearchIcon from '@material-ui/icons/Search';
const useStyles = makeStyles((theme) => ({
  composeButton: {
    marginLeft: 'auto',
  },
}));

type ConversationViewProps = {
  isMobile: boolean;
};
export function ConversationView(props: ConversationViewProps) {
  const classes = useStyles();

  return (
    <Box flexGrow={1}>
      <AppBar position="relative">
        <Toolbar>
          <Avatar>
            <PersonIcon />
          </Avatar>
          <Box mr={2} />
          <Typography variant="h5">Chat title here</Typography>
          <IconButton
            aria-label="Compose new message"
            // onClick={() => {}}
            color="inherit"
            size="small"
            className={classes.composeButton}
          >
            <CreateIcon fontSize="small" />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
