/* eslint-disable */
import { request } from '../../helpers/request';

export const getAccountTypes = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'user/account-types', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_ACCOUNT_TYPES', payload: response });
    }
};

export const getAccounts = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'user/accounts', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_ACCOUNTS', payload: response });
    }
};
