import React from 'react';
import { Outlet } from 'react-router';
import Home from '../components/pages/Home';

const NewUIRoutes = {
  path: '/',
  element: <Outlet />,
  children: [
    {
      path: '/',
      element: <Home />,
    },
  ],
};

export default NewUIRoutes;
