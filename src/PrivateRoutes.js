import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import VerifyLoggedIn from './VerifyUser';


export default function PrivateRoutes() {
  const currentUser = VerifyLoggedIn();

  if (currentUser === undefined) return null;

  return currentUser ? <Outlet /> : <Navigate to="/" />;
}
