import React from 'react';
import './App.css';
import FlowRoutes from './routes';
import { HashRouter } from 'react-router-dom';
import registerMainEventHandlers from 'newUserInterface/ipc/collection';

registerMainEventHandlers();

function App() {
  return (
    <HashRouter>
      <FlowRoutes />
    </HashRouter>
  );
}

export default App;
