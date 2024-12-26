/* eslint-disable */
import { request } from '../../../helpers/request';
import { History } from '../../../routes/NavigationSetter';

export const getPublicDepartments = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'all', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_DEPARTMENTS', payload: response.data });
    }
};

export const getDepartments = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'getAllDepartment', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_DEPARTMENTS', payload: response.data });
    }
};

export const getDepartment = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', `${payload.options.id}/getDepartment`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({
            type: 'SET_DEPARTMENT',
            payload: response.data,
        });
    }
};

export const addDepartment = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', 'addDepartment', payload.body, payload.options);
    if (response.status === 200) {
        History.navigate('/system/department')
    }
};
export const updateDepartment = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/update`, payload.body, payload.options);
    if (response.status === 200) {
        History.navigate('/system/department')
    }
};
export const deactivateDepartment = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/deactivateDepartment`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_DEPARTMENT_STATUS', payload: response.data });
    }
};
export const activateDepartment = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/activateDepartment`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_DEPARTMENT_STATUS', payload: response.data });
    }
};