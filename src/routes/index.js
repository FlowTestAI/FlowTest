import { useRoutes } from 'react-router';
import FlowRoutes from './FlowRoutes';
import MainRoutes from './MainRoutes';
import NewUIRoutes from 'routes/NewUIRoutes';

export default function Routes() {
  return useRoutes([MainRoutes, FlowRoutes, NewUIRoutes]);
}
