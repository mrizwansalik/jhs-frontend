/* eslint-disable */
import { request } from '../../../helpers/request';
import { History } from '../../../routes/NavigationSetter';

export const getAllTask = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'getAllTask', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_TASKS_LIST', payload: response.data });
    }
};
export const getTaskDetail = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', `${payload.options.id}/getTaskDetail`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({
            type: 'SET_MY_TASK',
            payload: response.data,
        });
    }
};
export const addTaskToArticle = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `addTaskToArticle`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch(getAllTask({ body: {}, options: { id: payload.options.id, btnLoader: true, __module: 'task', } })); 
    }
};

export const markTaskAsComplete = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/markTaskAsComplete`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch(getTaskDetail({ body: {}, options: { id: payload.options.id, btnLoader: true, __module: 'task', } })); 
    }
};
export const markTaskAsDone = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/markTaskAsDone`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch(getTaskDetail({ body: {}, options: { id: payload.options.id, btnLoader: true, __module: 'task', } })); 
    }
};

export const addCommentOnTask = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/addCommentOnTask`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch(getTaskDetail({ body: {}, options: { id: payload.options.id, btnLoader: true, __module: 'task', } })); 
    }
};
export const editTaskComment = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/editTaskComment`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch(getTaskDetail({ body: {}, options: { id: payload.options.id, btnLoader: true, __module: 'task', } })); 
    }
};
export const deleteTaskComment = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/deleteTaskComment`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch(getTaskDetail({ body: {}, options: { id: payload.options.id, btnLoader: true, __module: 'task', } })); 
    }
};


export const addChangeRequest = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/addChangeRequest`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch(getTaskDetail({ body: {}, options: { id: payload.options.id, btnLoader: true, __module: 'task', } })); 
    }
};
export const changeEditor = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/changeEditor`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch(getTaskDetail({ body: {}, options: { id: payload.options.id, btnLoader: true, __module: 'task', } })); 
    }
};
export const acceptChangeRequestWithNewEditor = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/acceptChangeRequestWithNewEditor`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch(getTaskDetail({ body: {}, options: { id: payload.options.id, btnLoader: true, __module: 'task', } })); 
    }
};
export const acceptChangeRequest = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/acceptChangeRequest`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch(getTaskDetail({ body: {}, options: { id: payload.options.id, btnLoader: true, __module: 'task', } })); 
    }
};
export const rejectChangeRequest = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/rejectChangeRequest`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch(getTaskDetail({ body: {}, options: { id: payload.options.id, btnLoader: true, __module: 'task', } })); 
    }
};
