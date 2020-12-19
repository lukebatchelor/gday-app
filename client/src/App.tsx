import React, { useContext, useEffect } from 'react';
import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core';
import { AppContext } from './contexts/AppContext';
import { UserContext } from './contexts/UserContext';

import { navigate, Router } from '@reach/router';
import { HomePage } from './pages/HomePage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { checkLoggedIn } from './api';
import { safeOff, safeOn } from './sockets';
import { ConversationCacheContext } from './contexts/ConversationCacheContext';

const theme = responsiveFontSizes(createMuiTheme());

type AppProps = {
  children?: React.ReactNode;
};
export function App(props: AppProps) {
  const appContext = useContext(AppContext);
  const [user, setUser] = useContext(UserContext);
  const { state, dispatch } = useContext(ConversationCacheContext);

  useEffect(() => {
    (async () => {
      const { loggedIn, user } = await checkLoggedIn();
      if (!loggedIn) {
        setUser({ userName: '', displayName: '', loggedIn: false, id: '', isAdmin: false });
        navigate(`${appContext.basePathPrefix}/sign-in`);
        return;
      }
      setUser({ ...user, loggedIn: true });
    })();
  }, []);

  useEffect(() => {
    safeOn('newMessage', (msg) => {
      dispatch({ type: 'NEW_MESSAGE', conversationId: msg.conversation, message: msg.message });
    });
    return () => safeOff('newMessage');
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Router basepath={appContext.basePathPrefix}>
        <SignInPage path="/sign-in" />
        <SignUpPage path="/sign-up" />
        {user && user.loggedIn && <HomePage path="/:conversationId" />}
        {user && user.loggedIn && <HomePage default path="/" />}
      </Router>
    </ThemeProvider>
  );
}
