/* eslint-disable */
import { History } from '../../routes/NavigationSetter';
import { request } from '../../helpers/request';
import { logOutUser } from 'helpers/globalHelpers';
import { logout } from 'store/auth/actions';

export const getProfile = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'getProfile', payload.body, payload.options);

    if (response?.status === 200) {
        dispatch({ type: 'SET_PROFILE', payload: response.data });
    } 
};
export const getProfileReport = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'getProfileReport', payload.body, payload.options);
    if (response?.status === 200) {
        dispatch({ type: 'SET_REPORT', payload: response.data });
    } 
};

export const updateProfile = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `updateProfile`, payload.body, payload.options);
    if (response.status === 200) {
     dispatch({ type: 'SET_PERSONAL_PROFILE', payload: response.data }); 
    } 
};


export const updatePassword = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `changeProfilePassword`, payload.body, payload.options);
    // dispatch({ type: 'SET_USER', payload: response.data });  
};