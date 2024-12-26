/* eslint-disable */
import { History } from '../../../routes/NavigationSetter';
import { request } from '../../../helpers/request';

export const createRole = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', 'add', payload.body, payload.options);
    if (response.status === 200) {
        History.navigate("/system/roles");
    }
};
export const getRoles = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'getAllRole', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_ROLES', payload: response.data });
    }
};

export const getRole = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', `${payload.options.id}/getRole`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_ROLE', payload: response.data });
    }
};

export const updateRole = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/update`, payload.body, payload.options);
    if (response.status === 200) {
        //this reducer set in profile
        dispatch({ type: 'UPDATE_ROLE', payload: response.data });
        History.navigate("/system/roles");
    }
};