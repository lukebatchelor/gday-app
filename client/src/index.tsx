import React from 'react';
import ReactDOM from 'react-dom';
import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core';
import { AppContextProvider } from './contexts/AppContext';
import { UserContextProvider } from './contexts/UserContext';

import { App } from './App';

const theme = responsiveFontSizes(createMuiTheme());

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AppContextProvider>
        <UserContextProvider>
          <App />
        </UserContextProvider>
      </AppContextProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
