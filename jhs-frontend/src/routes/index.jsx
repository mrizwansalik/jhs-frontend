/* eslint-disable */
import authRoutes from '../pages/auth';
import HomeRoutes from '../pages/home';
import clientRoutes from '../pages/client';
import mainClientRoute from '../pages/main';
import NotFound from '../pages/NotFound';

const routes = (isLoggedIn) => [
    ...HomeRoutes,
    ...authRoutes(isLoggedIn),
    ...clientRoutes(isLoggedIn),
    ...mainClientRoute(isLoggedIn),
    {
        path: '*',
        element: <NotFound />,
    }
];
export default routes;
