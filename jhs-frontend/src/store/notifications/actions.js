/* eslint-disable  */
import { request } from '../../helpers/request';

export const createToasts = (data) => (dispatch) => {
    const toastId = Math.floor(Math.random() * 999999);
    dispatch({ type: 'SET_TOAST', payload: { ...data, id: toastId } });
    setTimeout(() => {
        dispatch({ type: 'REMOVE_TOAST', payload: { id: toastId } });
    }, 2000);
};

export const getNotification = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', `webview-notifications/${payload.options.id}`, payload.body, payload.options);
    if (response?.status === 200) {
        dispatch({ type: 'SET_NOTIFICATION', payload: response.data });
    }
};
export const getAndReadNotification = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', `notifications/${payload.options.id}`, payload.body, payload.options);
    if (response?.status === 200) {
        dispatch({ type: 'SET_AND_READ_NOTIFICATION', payload: response.data });
    }
};
export const getNotifications = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', `notifications`, payload.body, payload.options);
    if (response?.status === 200) {
        dispatch({ type: 'SET_NOTIFICATIONS', payload: response });
    }
};
export const markAsReadNotifications = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PATCH', `mark-read-notifications`, payload.body, payload.options);
    if (response?.status === 200) {
        dispatch({ type: 'SET_NOTIFICATIONS', payload: response.data });
    }
};
export const getAnnouncements = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', `notifications`, payload.body, payload.options);
    if (response?.status === 200) {
        dispatch({ type: 'SET_ANNOUNCEMENT', payload: response });
    }
};
