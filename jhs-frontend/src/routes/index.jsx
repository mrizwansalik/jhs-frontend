/* eslint-disable */
import authRoutes from '../pages/auth';
import HomeRoutes from '../pages/home';
import clientRoutes from '../pages/client';
import mainClientRoute from '../pages/main';
import NotFound from '../pages/NotFound';

const routes = (isLoggedIn, location) => [
    ...HomeRoutes,
    ...authRoutes(isLoggedIn, location),
    ...clientRoutes(isLoggedIn, location),
    ...mainClientRoute(isLoggedIn, location),
    {
        path: '*',
        element: <NotFound />,
    }
];
export default routes;
