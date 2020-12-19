import React, { useState, useContext } from 'react';

import {
  makeStyles,
  Container,
  CssBaseline,
  FormHelperText,
  Button,
  Avatar,
  TextField,
  Typography,
  Box,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Link, RouteComponentProps } from '@reach/router';
import { useForm, Controller } from 'react-hook-form';

import { attemptLogin } from '../api';
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
    height: theme.spacing(30),
    width: theme.spacing(30),
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

type FormErrors = {
  username?: string;
  password?: string;
  login?: string;
};

const defaultErrors: FormErrors = {
  username: '',
  password: '',
  login: '',
};

export type SignInPageProps = RouteComponentProps;
export function SignInPage(props: SignInPageProps) {
  const { navigate } = props;
  const appContext = useContext(AppContext);
  const [, setUser] = useContext(UserContext);
  const { handleSubmit, control } = useForm<FormValues>({ defaultValues });
  const [errors, setErrors] = useState<FormErrors>(defaultErrors);
  const classes = useStyles();

  const onSubmit = (data: FormValues) => {
    const { username, password } = data;
    if (!username || !password) {
      setErrors({
        username: !username ? 'Username is required' : '',
        password: !password ? 'Password is required' : '',
      });
      return;
    }
    attemptLogin(username, password).then((res) => {
      if (res.loggedIn) {
        setUser({ ...res.user, loggedIn: true });
        navigate(`${appContext.basePathPrefix}/`);
      } else {
        setErrors({ login: 'Username or Password is incorrect' });
      }
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography variant="h2">G&apos;day</Typography>
        <Avatar className={classes.avatar} src={`${appContext.basePathPrefix}/logo_512x512.png`}></Avatar>
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
                error={!!errors.username}
                helperText={errors.username}
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
                error={!!errors.password}
                helperText={errors.password}
                onChange={onChange}
                onBlur={onBlur}
                value={value}
              />
            )}
          />
          <FormHelperText error>{errors.login}</FormHelperText>
          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
            Sign In
          </Button>
          <Box mt={2} />
          <Typography align="center">
            Don&apos;t have an account? <Link to="/sign-up">Sign up</Link>
          </Typography>
        </form>
      </div>
    </Container>
  );
}
