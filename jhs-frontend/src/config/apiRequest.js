/* eslint-disable no-param-reassign */
/* eslint-disable no-lonely-if */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
import axios from 'axios';
import { config as mainConfig } from './config';
// Store requests
const sourceRequest = {};
const defaultOptions = {
    baseURL: mainConfig.data().API_URL, // TODO: Move to env or config file
    headers: mainConfig.data().defaultHeaders,
};
const MAX_REQUESTS_COUNT = 1;
const INTERVAL_MS = 10;
let PENDING_REQUESTS = 0;
const instance = axios.create(defaultOptions);
// Request interceptor
instance.interceptors.request.use(
    function (config) {
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                if (PENDING_REQUESTS < MAX_REQUESTS_COUNT) {
                    PENDING_REQUESTS++;
                    clearInterval(interval);
                    // Before request sent
                    // Inject in body
                    if (config.data instanceof FormData) {
                        Object.entries(mainConfig.data().defaultBodyData).forEach(([key, val]) => {
                            config.data.append(key, val);
                        });
                    } else {
                        if (config.method === 'get') {
                            config.params = {
                                ...config.params,
                                ...mainConfig.data().defaultBodyData,
                            };
                        } else if (config.method === 'post') {
                            config.data = {
                                ...config.data,
                                ...mainConfig.data().defaultBodyData,
                            };
                        } else if (config.method === 'put') {
                            config.data = {
                                ...config.data,
                                ...mainConfig.data().defaultBodyData,
                            };
                        }
                    }
                    // Update accessToken in localStorage
                    if (localStorage.getItem('accessToken')) {
                        config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
                    }
                    resolve(config);
                }
            }, INTERVAL_MS);
        });
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);
instance.interceptors.request.use(
    (request) => {
        // If the application exists cancel
        if (sourceRequest[request.url]) {
            sourceRequest[request.url].cancel('Automatic cancellation');
        }
        // Store or update application token
        const axiosSource = axios.CancelToken.source();
        sourceRequest[request.url] = { cancel: axiosSource.cancel };
        request.cancelToken = axiosSource.token;
        return request;
    },
    (error) => {
        return Promise.reject(error);
    }
);
// Response interceptor
instance.interceptors.response.use(
    function (response) {
        // Update accessToken in localStorage
        if (response.data.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
        }
        PENDING_REQUESTS = Math.max(0, PENDING_REQUESTS - 1);
        return response;
    },
    function (error) {
        
        if (error?.response?.data?.accessToken) {
            localStorage.setItem('accessToken', error.response.data.accessToken);
        }
        PENDING_REQUESTS = Math.max(0, PENDING_REQUESTS - 1);
        return Promise.reject(error);
        // throw new Error(error);
    }
);
export default instance;
