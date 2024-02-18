import React from 'react';
import './App.css';
import FlowRoutes from './routes';
import { BrowserRouter } from 'react-router-dom';
import { StyledEngineProvider, CssBaseline } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { socketConnection } from './socket.io';

socketConnection();

function App() {
  return (
    <BrowserRouter>
      <StyledEngineProvider injectFirst>
        <SnackbarProvider>
          <CssBaseline />
          <FlowRoutes />
        </SnackbarProvider>
      </StyledEngineProvider>
    </BrowserRouter>
  );
}

export default App;
