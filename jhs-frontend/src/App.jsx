/* eslint-disable */
import React from 'react';
import { useRoutes } from 'react-router-dom';
import routes from './routes';

const App = () => {
    let { isLoggedIn } = false;

    const sessionAuth = JSON.parse(localStorage.auth ?? '{"authenticated":false,"user":{}}');
    if (sessionAuth && sessionAuth.user && sessionAuth.authenticated) {
        isLoggedIn = sessionAuth.authenticated;
    }
    const routing = useRoutes(routes(isLoggedIn));

    return (
        <>
            {/* Application Routes */}
            {routing}
        </>
    );
};

export default App;
