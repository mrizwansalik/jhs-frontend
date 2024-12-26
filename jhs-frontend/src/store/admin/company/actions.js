/* eslint-disable */
import { History } from '../../../routes/NavigationSetter';
import { request } from '../../../helpers/request';

export const getCompany = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', `getCompany`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_COMPANY', payload: response.data });
    }
};

export const getCompanyWithOwner = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'getCompanyWithOwner', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_COMPANY', payload: response.data });
    }
};

export const updateCompany = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `updateCompany`, payload.body, payload.options);
    if (response.status === 200) {
        History.push('/system/company')
    }
};