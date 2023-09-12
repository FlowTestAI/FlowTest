import logo from './logo.svg';
import './App.css';
import FlowRoutes from './routes';
import { BrowserRouter } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
        <FlowRoutes/>
    </BrowserRouter>
  );
}

export default App;
