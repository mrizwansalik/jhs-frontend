/* eslint-disable */
import { request } from '../../helpers/request';

export const fetchTotalAssets = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'assets-overview', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_TOTAL_ASSETS', payload: response.data.totalAssets });
    }
};

export const fetchRecentTransactions = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'user/transactions/?limit=5', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({
            type: 'SET_RECENT_TRANSACTIONS',
            payload: response.data.transactions,
        });
    }
};

export const fetchRecentOrders = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'orders?limit=5', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_RECENT_ORDERS', payload: response.data.orders });
    }
};

export const getReferrals = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'referrals', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_REFERRALS', payload: response.data });
    }
};
