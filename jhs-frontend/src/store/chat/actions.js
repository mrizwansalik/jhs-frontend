/* eslint-disable */
import { History } from '../../routes/NavigationSetter';
import { request } from '../../helpers/request';

export const getChat = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', 'get-chat', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_CHAT', payload: response.data });
    }
};
export const attachments = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', 'attachment', payload.body, payload.options);
    if (response.status === 200) {
       // dispatch({ type: 'SET_CHAT', payload: response.data });
    }
};
