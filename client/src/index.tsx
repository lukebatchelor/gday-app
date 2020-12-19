import React from 'react';
import ReactDOM from 'react-dom';
import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core';
import { AppContextProvider } from './contexts/AppContext';
import { UserContextProvider } from './contexts/UserContext';
import { ConversationCacheContextProvider } from './contexts/ConversationCacheContext';

import { App } from './App';
import { initialiseSocket } from './sockets';

// socket should be initialised once and then accessed using the safe methods
initialiseSocket();
const theme = responsiveFontSizes(createMuiTheme());

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AppContextProvider>
        <UserContextProvider>
          <ConversationCacheContextProvider>
            <App />
          </ConversationCacheContextProvider>
        </UserContextProvider>
      </AppContextProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
