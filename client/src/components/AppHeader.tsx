import React from 'react';
import { AppBar, Avatar, Box, IconButton, makeStyles, Toolbar, Typography } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import CreateIcon from '@material-ui/icons/Create';

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
};
export function AppHeader(props: AppHeaderProps) {
  const classes = useStyles();
  const { isMobile } = props;

  return (
    <AppBar style={{ flexDirection: isMobile ? 'column' : 'row' }}>
      <Box width={isMobile ? 'auto' : '35vw'}>
        <Toolbar>
          <Avatar>
            <PersonIcon />
          </Avatar>
          <Box mr={2} />
          <Typography variant="h5">Chats</Typography>
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
      </Box>
      {!isMobile && (
        <Toolbar>
          <Avatar>
            <PersonIcon />
          </Avatar>
        </Toolbar>
      )}
    </AppBar>
  );
}
