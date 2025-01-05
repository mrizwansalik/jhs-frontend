/* eslint-disable */
import React from 'react';
import { Navigate } from 'react-router-dom';

import Login from './Login';
import ForgetPassword from './forgetPassword';
import Signup from './SignUp';
import ChangePassword from './ChangePassword';

const authRoutes = (isLoggedIn, location) => [
    {
        path: '/login',
        element: isLoggedIn ? <Navigate to="/" /> : <Login />,
    },
    {
        path: '/signup',
        element: isLoggedIn ? <Navigate to="/" /> : <Signup />,
    },
    {
        path: '/forget-password',
        element: isLoggedIn ? <Navigate to="/" /> : <ForgetPassword />,
    },
    {
        path: '/change-password/:userId/:token',
        element: isLoggedIn ? <Navigate to="/" /> : <ChangePassword />,
    },
];

export default authRoutes;
