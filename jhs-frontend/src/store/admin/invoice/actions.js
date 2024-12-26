/* eslint-disable */
import { History } from '../../../routes/NavigationSetter';
import { request } from '../../../helpers/request';

export const createInvoice = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', 'addInvoice', payload.body, payload.options);
    if (response.status === 200) {
        History.navigate("/system/invoice");
    }
};
export const getAllInvoice = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'getAllInvoice', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_ALL_INVOICE', payload: response.data });
    }
};
export const getAllInvoiceWithClient = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'getAllInvoiceWithClient', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_ALL_INVOICE', payload: response.data });
    }
};

export const getInvoice = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', `${payload.options.id}/getInvoice`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_INVOICE', payload: response.data });
    }
};

export const updateInvoice = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/update`, payload.body, payload.options);
    if (response.status === 200) {
        History.navigate("/system/invoice");
    }
};