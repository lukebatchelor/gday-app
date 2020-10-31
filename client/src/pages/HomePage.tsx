import React from 'react';
import { AppBar, Avatar, Container, CssBaseline, IconButton, makeStyles, Toolbar, Typography } from '@material-ui/core';
import { RouteComponentProps } from '@reach/router';

const useStyles = makeStyles((theme) => ({}));

type HomeProps = RouteComponentProps;
export function HomePage(props: HomeProps) {
  const classes = useStyles();

  return (
    <Container>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <IconButton color="inherit" aria-label="Home" edge="start">
            <Avatar src="/android-chrome-192x192.png" alt="LB" />
          </IconButton>
          <Typography variant="h5">2020 Typescript Webpack Static App Template</Typography>
        </Toolbar>
      </AppBar>
    </Container>
  );
}
