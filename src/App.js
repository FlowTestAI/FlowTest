import logo from './logo.svg';
import './App.css';
import FlowRoutes from './routes';
import { BrowserRouter } from 'react-router-dom'
import { StyledEngineProvider, CssBaseline } from '@mui/material';

import { SnackbarProvider } from 'notistack';

function App() {
  return (
    <BrowserRouter>
      <StyledEngineProvider injectFirst>
        <SnackbarProvider>
          <CssBaseline/>
          <FlowRoutes/>
        </SnackbarProvider>
      </StyledEngineProvider>
    </BrowserRouter>
  );
}

export default App;
