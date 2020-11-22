import React from 'react';
import ReactDOM from 'react-dom';
import { createMuiTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core';
import { AppContextProvider } from './contexts/AppContext';
import { UserContextProvider } from './contexts/UserContext';

import { App } from './App';
import { initialiseSocket } from './sockets';

const theme = responsiveFontSizes(createMuiTheme());
const socket = initialiseSocket();
socket.on('newMessage', ({ conversation, message }: { conversation: string; message: IMessage }) =>
  console.log(`New message in conversation ${conversation}: ${message.content}`)
);

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
