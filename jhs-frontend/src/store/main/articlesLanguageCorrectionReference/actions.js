/* eslint-disable */
import { request } from '../../../helpers/request';

export const addLanguageCorrectionReference = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/LanguageCorrection/addLanguageCorrectionReference`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_ARTICLE_LANGUAGE_CORRECTION', payload: response.data });
    }
};
export const getLanguageCorrectionReference = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/LanguageCorrection/getLanguageCorrectionReference`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_ARTICLE_LANGUAGE_CORRECTION', payload: response.data });
    }
};
export const getSpecificLanguageCorrectionReference = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', `${payload.options.id}/${payload.options.referenceId}/LanguageCorrection/getSpecificLanguageCorrectionReference`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_SINGLE_LANGUAGE_CORRECTION_REFERENCE', payload: response.data });
    }
};
export const updateLanguageCorrectionReference = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/LanguageCorrection/updateLanguageCorrectionReference`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_ARTICLE_LANGUAGE_CORRECTION', payload: response.data });
    }
};
export const generateLanguageCorrectionReference = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/LanguageCorrection/generateLanguageCorrectionReference`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_ARTICLE_LANGUAGE_CORRECTION', payload: response.data });
    }
};

export const removeLanguageCorrectionReference = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/LanguageCorrection/removeLanguageCorrectionReference`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_ARTICLE_LANGUAGE_CORRECTION', payload: response.data });
    }
};
export const updateLanguageCorrectionReferenceSorting = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/LanguageCorrection/updateLanguageCorrectionReferenceSorting`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_ARTICLE_LANGUAGE_CORRECTION', payload: response.data });
    }
};
