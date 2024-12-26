/* eslint-disable */
import { History } from '../../../routes/NavigationSetter';
import { request } from '../../../helpers/request';

export const createPermission = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', 'add', payload.body, payload.options);
    if (response.status === 200) {
        History.navigate("/system/permissions");
    }
};
export const getPermissions = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'getAllPermission', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_PERMISSIONS', payload: response });
    }
};
export const getPermission = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', `${payload.options.id}/getPermission`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_PERMISSION', payload: response.data });
    }
};

export const updatePermission = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/update`, payload.body, payload.options);
    if (response.status === 200) {
        History.navigate("/system/permissions");
    }
};