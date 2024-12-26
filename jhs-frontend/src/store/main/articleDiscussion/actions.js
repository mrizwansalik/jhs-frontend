/* eslint-disable */
import { request } from '../../../helpers/request';

export const getArticleDiscussion = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', 'getArticleDiscussion', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_ARTICLE_DISCUSSION_TYPE', payload: response.data });
    }
};
export const getDiscussionReply = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', 'getDiscussionReply', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_ARTICLE_DISCUSSION_REPLY', payload: response.data });
    }
};
export const getArticleDiscussionReply = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', 'getArticleDiscussionReply', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_ARTICLE_DISCUSSION_REPLY', payload: response.data });
    }
};
export const attachments = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', 'attachment', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_ARTICLE_DISCUSSION_REPLY', payload: response.data });
    }
};
