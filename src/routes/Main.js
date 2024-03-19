import React from 'react';
import { Outlet } from 'react-router';
import Home from '../components/pages/Home';

const Main = {
  path: '/',
  element: <Outlet />,
  children: [
    {
      path: '/',
      element: <Home />,
    },
  ],
};

export default Main;
