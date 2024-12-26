/* eslint-disable */
import { History } from '../../../routes/NavigationSetter';
import { request } from '../../../helpers/request';

export const createServices = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', 'addServices', payload.body, payload.options);
    if (response.status === 200) {
        History.navigate("/system/services");
    }
};
export const getAllServices = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'getAllServices', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_ALL_SERVICES', payload: response.data });
    }
};

export const getServices = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', `${payload.options.id}/getServices`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_SERVICES', payload: response.data });
    }
};

export const updateServices = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/update`, payload.body, payload.options);
    if (response.status === 200) {
        History.navigate("/system/services");
    }
};