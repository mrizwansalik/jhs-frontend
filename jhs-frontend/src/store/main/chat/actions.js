/* eslint-disable */
import { request } from '../../../helpers/request';
import { History } from '../../../routes/NavigationSetter';

export const getChats = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'chat', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_CHATS', payload: response.data });
    }
};

export const getDraftChats = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'getAllDraftChat', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_DRAFT_CHATS', payload: response.data });
    }
};

export const getAssignedChats = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'getAllAssignedChats', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_ASSIGNED_CHATS', payload: response.data });
    }
};

export const getChat = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', `${payload.options.id}/getChatDetail`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({
            type: 'SET_MY_CHAT',
            payload: response.data,
        });
    }
};

export const getStarted = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', 'getStarted', payload.body, payload.options);
    if (response.status === 200) {
        History.navigate('/main/chat/'+response.data._id+'/edit/title')
    }
};

export const updateChat = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/update`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_CHAT', payload: response.data });
    }
};

export const validateChat = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/validateChat`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_CHAT', payload: response.data });
    }
};


export const submitChat = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/submitChat`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_CHAT', payload: response.data });
    }
};

export const deactivateChat = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/deactivateChat`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_CHAT_DELETED', payload: response.data });
    }
};
export const activateChat = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/activateChat`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_CHAT_DELETED', payload: response.data });
    }
};
export const deleteMyChat = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/deleteMyChat`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_CHAT_DELETED', payload: response.data });
    }
};
