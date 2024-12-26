/* eslint-disable consistent-return */
import { browserName, browserVersion, osName, osVersion } from 'react-device-detect';
import { v4 as uuidv4 } from 'uuid';

let { deviceId } = localStorage;
if (!deviceId) {
    const uuid = uuidv4();
    deviceId = uuid;
    localStorage.setItem('deviceId', uuid);
}

export const config = {
    data() {
        // let HOST;
        // if (process.env?.REACT_APP_ENVIRONMENT === 'staging') {
        //     HOST = '34.230.40.148';
        // } else {
        //     HOST = '54.211.107.6';
        // }
        return {
            defaultHeaders: {
                'info-device-id': deviceId,
                'info-device-token': null,
                'info-os': osName,
                'info-os-version': osVersion,
                'info-browser': browserName,
                'info-browser-version': browserVersion,
            },
            // API_URL: process.env.REACT_APP_API_URL,
            API_URL: import.meta.env.VITE_REACT_APP_API_URL ,
            CHAT_SOCKET_URL: import.meta.env.VITE_REACT_APP_CHAT_SOCKET_URL,
            NOTIFICATION_SOCKET_URL:import.meta.env.VITE_REACT_APP_NOTIFICATION_SOCKET_URL,
            ARTICLE_PROCESSING_SOCKET_URL:import.meta.env.VITE_REACT_APP_ARTICLE_PROCESSING_SOCKET_URL,
            ARTICLE_DISCUSSION_SOCKET_URL:import.meta.env.VITE_REACT_APP_ARTICLE_DISCUSSION_SOCKET_URL,
            // ME_SOCKET_URL: process.env.REACT_APP_ME_SOCKET_URL
            // API_URL: "http://127.0.0.1:3001/",
        };
    },

    methods: {
        getConfig(property) {
            if (property === 'PER_PAGE') {
                return import.meta.env.VITE_VUE_APP_PER_PAGE ?? 10;
            }
            if (property === 'TABLE_ROWS') {
                return [10, 25, 50, 100, 200];
            }
            if (property === 'TOAST_TIME_OUT') {
                return import.meta.env.VITE_TOAST_TIME_OUT ?? 2000;
            }
        },
    },
};
