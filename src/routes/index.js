import { useRoutes } from 'react-router';
import NewUIRoutes from 'routes/NewUIRoutes';

export default function Routes() {
  return useRoutes([NewUIRoutes]);
}
