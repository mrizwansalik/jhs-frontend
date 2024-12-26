/* eslint-disable */
import { History } from '../../../routes/NavigationSetter';
import { request } from '../../../helpers/request';


export const getPublicUser = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'all', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_USERS', payload: response });
    }
};

export const getUser = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', `${payload.options.id}/getUser`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_USER', payload: response.data });
    }
};

export const getUsers = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'getAllUser', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_USERS', payload: response });
    }
};

export const addNewUser = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', 'addUser', payload.body, payload.options);
    if (response.status === 200) {
        History.push('/system/users')
    }
};

export const updateUser = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/update`, payload.body, payload.options);
    if (response.status === 200) {
        History.push('/system/users')
    }
};
export const deactivateUser = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/deactivateUser`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_USER_STATUS', payload: response.data });
    }
};

export const activateUser = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/activateUser`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_USER_STATUS', payload: response.data });
    }
};

