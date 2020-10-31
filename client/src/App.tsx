import React from 'react';
import { makeStyles, Avatar, Container, CssBaseline, AppBar, Toolbar, Typography, IconButton } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  avatar: {
    background: theme.palette.success.main,
  },
}));

type AppProps = {
  children?: React.ReactNode;
};
export function App(props: AppProps) {
  const classes = useStyles();

  return (
    <Container>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <IconButton color="inherit" aria-label="Home" edge="start">
            <Avatar src="/android-chrome-192x192.png" alt="LB" className={classes.avatar} />
          </IconButton>
          <Typography variant="h5">2020 Typescript Webpack Static App Template</Typography>
        </Toolbar>
      </AppBar>
    </Container>
  );
}
