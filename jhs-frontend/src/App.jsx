/* eslint-disable */
import React from 'react';
import { Navigate, useLocation, useRoutes } from 'react-router-dom';
import routes from './routes';

const App = () => {
    let { isLoggedIn } = false;
    const location = useLocation();

    const sessionAuth = JSON.parse(localStorage.auth ?? '{"authenticated":false,"user":{}}');
    if (sessionAuth && sessionAuth.user && sessionAuth.authenticated) {
        isLoggedIn = sessionAuth.authenticated;
    }

    const routing = useRoutes(routes(isLoggedIn, location));

    return (
        <>
            {/* Application Routes */}
            {routing}
        </>
    );
};

export default App;
