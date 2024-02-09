import logo from './logo.svg';
import './App.css';
import FlowRoutes from './routes';
import { BrowserRouter } from 'react-router-dom'
import { StyledEngineProvider, CssBaseline } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { socketConnection } from './socket.io';

function App() {
  return (
    <BrowserRouter>
      <StyledEngineProvider injectFirst>
        <SnackbarProvider>
          <CssBaseline/>
          <FlowRoutes socket={socketConnection()}/>
        </SnackbarProvider>
      </StyledEngineProvider>
    </BrowserRouter>
  );
}

export default App;
