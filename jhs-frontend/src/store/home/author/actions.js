/* eslint-disable */
import fileDownload from 'js-file-download';
import { request } from '../../../helpers/request';


export const getPublicAuthorList = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'getPublicAuthorList', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_HOME_AUTHORS', payload: response });
    }
};
export const getPublicSingleAuthor = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', `${payload.options.id}/getPublicSingleAuthor`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_HOME_SINGLE_AUTHOR', payload: response.data });
        dispatch({ type: "SET_COMPONENT_LOADING", payload: false });
    }
};