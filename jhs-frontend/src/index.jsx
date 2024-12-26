/* eslint-disable */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './store';
import { NavigationSetter } from './routes/NavigationSetter';
import { HelmetProvider } from 'react-helmet-async';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    // <React.StrictMode>
    <BrowserRouter>
        <NavigationSetter />
        <Provider store={store}>
            <HelmetProvider>
                <App />
            </HelmetProvider>
        </Provider>
    </BrowserRouter>
    // </React.StrictMode>
);
