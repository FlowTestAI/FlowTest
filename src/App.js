import React from 'react';
import './App.css';
import FlowRoutes from './routes';
import { HashRouter } from 'react-router-dom';

function App() {
  return (
    <HashRouter>
      <FlowRoutes />
    </HashRouter>
  );
}

export default App;
