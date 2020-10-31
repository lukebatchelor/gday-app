import React, { useState, useEffect, useContext } from 'react';

import {
  makeStyles,
  Container,
  CssBaseline,
  FormHelperText,
  Button,
  Box,
  Avatar,
  TextField,
  Typography,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { useForm, Controller } from 'react-hook-form';

import { attemptLogin } from '../api';
import { RouteComponentProps } from '@reach/router';
import { AppContext } from '../contexts/AppContext';
import { UserContext } from '../contexts/UserContext';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

type FormValues = {
  username: string;
  password: string;
};

const defaultValues: FormValues = {
  username: '',
  password: '',
};

export type SignInPageProps = RouteComponentProps;
export function SignInPage(props: SignInPageProps) {
  const { navigate } = props;
  const appContext = useContext(AppContext);
  const { handleSubmit, control } = useForm<FormValues>({
    defaultValues,
  });
  const [, setUser] = useContext(UserContext);
  const classes = useStyles();

  const onSubmit = (data: FormValues) => {
    const { username, password } = data;
    attemptLogin(username, password).then((res) => {
      console.log(res);
      if (res.loggedIn) {
        setUser({ ...res.user, loggedIn: true });
        navigate(`${appContext.basePathPrefix}/`);
        console.log('here');
      }
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography variant="h2">G&apos;day</Typography>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name="username"
            render={({ onChange, onBlur, value }) => (
              <TextField
                label="Username"
                variant="outlined"
                margin="normal"
                fullWidth
                autoFocus
                onChange={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ onChange, onBlur, value }) => (
              <TextField
                label="Password"
                type="password"
                autoComplete="current-password"
                variant="outlined"
                fullWidth
                margin="normal"
                onChange={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}
          />

          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
            Sign In
          </Button>
        </form>
      </div>
    </Container>
  );
}
