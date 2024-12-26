/* eslint-disable */
import { request } from '../../../helpers/request';
import { History } from '../../../routes/NavigationSetter';


export const getArticleLanguageCorrections = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'getAllArticleLanguageCorrection', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_ARTICLES_LANGUAGE_CORRECTION', payload: response });
    }
};
export const getArticleLanguageCorrection = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', `${payload.options.id}/getArticleLanguageCorrectionDetail`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({
            type: 'SET_MY_ARTICLE_LANGUAGE_CORRECTION',
            payload: response.data,
        });
    }
};
export const updateArticleLanguageCorrection = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/updateLanguageCorrection`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_ARTICLE_LANGUAGE_CORRECTION', payload: response.data });
    }
};
export const addArticleLanguageCorrectionTable = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/languageCorrection/addLanguageCorrectionTable`, payload.body, payload.options);
    if (response.status === 200) {
        payload?.editor.execute("insertData", { id: response.data.insertedId, data: payload.body })
        dispatch({ type: 'SET_MY_ARTICLE_LANGUAGE_CORRECTION_TABLES', payload: response.data });
        dispatch(getArticleLanguageCorrection({ body: {}, options: { id: payload.options.id, btnLoader: true, __module: 'articleLanguageCorrection', } }));    //payload.options.id

    }
};
export const updateArticleLanguageCorrectionTable = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/languageCorrection/updateLanguageCorrectionTable`, payload.body, payload.options);
    if (response.status === 200) {
        payload?.editor.execute("insertData", { id: response.data.updatedId, data: payload.body })
        dispatch({ type: 'SET_MY_ARTICLE_LANGUAGE_CORRECTION_TABLES', payload: response.data });
        dispatch(getArticleLanguageCorrection({ body: {}, options: { id: payload.options.id, btnLoader: true, __module: 'articleLanguageCorrection', } }));    //payload.options.id

    }
};
export const deleteArticleLanguageCorrectionTable = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/languageCorrection/removeLanguageCorrectionTable`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch(getArticleLanguageCorrection({ body: {}, options: { id: payload.options.id, btnLoader: true, __module: 'articleLanguageCorrection', } }));    //payload.options.id
        payload?.editor.model.change(writer => {
            const root = payload?.editor.model.document.getRoot();
            const range = writer.createRangeIn(root);
            const itemsToRemove = [];
            for (const value of range.getWalker()) {
                //@fixme do r&d and find appropriate function to get ._attrs
                if (value.item.is("element", "tablePreview") && value?.item?._attrs?.get('id') === payload.body?.articleTableID) {

                    itemsToRemove.push(value.item);
                } // end if
            } // end for 
            for (const item of itemsToRemove) {
                writer.remove(item); // remove all of the items.
            }
        });
    }
};

export const addArticleLanguageCorrectionFigure = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/languageCorrection/addLanguageCorrectionFigure`, payload.body, payload.options);
    if (response.status === 200) {
        payload?.editor.execute("insertFigureData", { id: response.data.insertedId, data: payload.body })
        dispatch({ type: 'SET_MY_ARTICLE_LANGUAGE_CORRECTION_TABLES', payload: response.data });
        dispatch(getArticleLanguageCorrection({ body: {}, options: { id: payload.options.id, btnLoader: true, __module: 'articleLanguageCorrection', } }));    //payload.options.id

    }
};
export const updateArticleLanguageCorrectionFigure = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/languageCorrection/updateLanguageCorrectionFigure`, payload.body, payload.options);
    if (response.status === 200) {
        payload?.editor.execute("insertFigureData", { id: response.data.updatedId, data: payload.body })
        dispatch({ type: 'SET_MY_ARTICLE_LANGUAGE_CORRECTION_TABLES', payload: response.data });
        dispatch(getArticleLanguageCorrection({ body: {}, options: { id: payload.options.id, btnLoader: true, __module: 'articleLanguageCorrection', } }));    //payload.options.id

    }
};
export const deleteArticleLanguageCorrectionFigure = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/languageCorrection/removeLanguageCorrectionFigure`, payload.body, payload.options);
    if (response.status === 200) {
        // dispatch({ type: 'SET_MY_ARTICLE_LANGUAGE_CORRECTION_DELETED', payload: response.data });
        dispatch(getArticleLanguageCorrection({ body: {}, options: { id: payload.options.id, btnLoader: true, __module: 'articleLanguageCorrection', } }));    //payload.options.id
        payload?.editor.model.change(writer => {
            const root = payload?.editor.model.document.getRoot();
            const range = writer.createRangeIn(root);
            const itemsToRemove = [];

            for (const value of range.getWalker()) {
                //@fixme do r&d and find appropriate function to get ._attrs
                if (value.item.is("element", "figurePreview") && value?.item?._attrs?.get('id') === payload.body?.articleFigureID) {
                    itemsToRemove.push(value.item);
                }
            }

            for (const item of itemsToRemove) {
                writer.remove(item); // remove all of the items.
            }

        });
    }

};


export const validateArticleLanguageCorrection = (payload) => async (dispatch) => {
    try {
        const response = await request.makeRequest('PUT', `${payload.options.id}/languageCorrection/validateArticleLanguageCorrection`, payload.body, payload.options);
        if (response.status === 200) {
            dispatch({ type: 'RESET_FORM_ERRORS' });
        }
    } catch (e) { }
};
export const submitArticleLanguageCorrection = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/languageCorrection/submitArticleLanguageCorrection`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_ARTICLE_LANGUAGE_CORRECTION', payload: response.data });
        History.navigate('/main/article/' + response.data._id + '/showArticle')
    }
};

export const getArticleLanguageCorrectionReferencesTextList = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', `${payload.options.id}/getArticleLanguageCorrectionReferencesTextList`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({
            type: 'SET_SINGLE_LANGUAGE_CORRECTION_REFERENCES_TEXT_LIST',
            payload: response.data,
        });
    }
};