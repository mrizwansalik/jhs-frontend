/* eslint-disable */
import { request } from '../../../helpers/request';
import { History } from '../../../routes/NavigationSetter';


export const getArticleRevisions = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'getAllArticleRevision', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_ARTICLES_REVISION', payload: response });
    }
};
export const getArticleRevision = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', `${payload.options.id}/getArticleRevisionDetail`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({
            type: 'SET_MY_ARTICLE_REVISION',
            payload: response.data,
        });
    }
};
export const updateArticleRevision = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/updateRevision`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_ARTICLE_REVISION', payload: response.data });
    }
};
export const addArticleRevisionTable = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/revision/addRevisionTable`, payload.body, payload.options);
    if (response.status === 200) {
        payload?.editor.execute("insertData", { id: response.data.insertedId, data: payload.body })
        dispatch({ type: 'SET_MY_ARTICLE_REVISION_TABLES', payload: response.data });
        dispatch(getArticleRevision({ body: {}, options: { id: payload.options.id, btnLoader: true, __module: 'articleRevision', } }));    //payload.options.id

    }
};
export const updateArticleRevisionTable = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/revision/updateRevisionTable`, payload.body, payload.options);
    if (response.status === 200) {
        payload?.editor.execute("insertData", { id: response.data.updatedId, data: payload.body })
        dispatch({ type: 'SET_MY_ARTICLE_REVISION_TABLES', payload: response.data });
        dispatch(getArticleRevision({ body: {}, options: { id: payload.options.id, btnLoader: true, __module: 'articleRevision', } }));    //payload.options.id

    }
};
export const deleteArticleRevisionTable = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/revision/removeRevisionTable`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch(getArticleRevision({ body: {}, options: { id: payload.options.id, btnLoader: true, __module: 'articleRevision', } }));    //payload.options.id
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
export const addArticleRevisionFigure = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/revision/addRevisionFigure`, payload.body, payload.options);
    if (response.status === 200) {
        payload?.editor.execute("insertFigureData", { id: response.data.insertedId, data: payload.body })
        dispatch({ type: 'SET_MY_ARTICLE_REVISION_TABLES', payload: response.data });
        dispatch(getArticleRevision({ body: {}, options: { id: payload.options.id, btnLoader: true, __module: 'articleRevision', } }));    //payload.options.id

    }
};
export const updateArticleRevisionFigure = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/revision/updateRevisionFigure`, payload.body, payload.options);
    if (response.status === 200) {
        payload?.editor.execute("insertFigureData", { id: response.data.updatedId, data: payload.body })
        dispatch({ type: 'SET_MY_ARTICLE_REVISION_TABLES', payload: response.data });
        dispatch(getArticleRevision({ body: {}, options: { id: payload.options.id, btnLoader: true, __module: 'articleRevision', } }));    //payload.options.id

    }
};
export const deleteArticleRevisionFigure = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/revision/removeRevisionFigure`, payload.body, payload.options);
    if (response.status === 200) {
        // dispatch({ type: 'SET_MY_ARTICLE_REVISION_DELETED', payload: response.data });
        dispatch(getArticleRevision({ body: {}, options: { id: payload.options.id, btnLoader: true, __module: 'articleRevision', } }));    //payload.options.id
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
export const validateArticleRevision = (payload) => async (dispatch) => {
    try {
        const response = await request.makeRequest('PUT', `${payload.options.id}/revision/validateArticleRevision`, payload.body, payload.options);
        if (response.status === 200) {
            dispatch({ type: 'RESET_FORM_ERRORS' });
        }
    } catch (e) { }
};
export const submitArticleRevision = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/revision/submitArticleRevision`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_ARTICLE_REVISION', payload: response.data });
        History.navigate('/main/article/' + response.data._id + '/showArticle')
    }
};
export const getArticleRevisionReferencesTextList = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', `${payload.options.id}/getArticleRevisionReferencesTextList`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({
            type: 'SET_SINGLE_REVISION_REFERENCES_TEXT_LIST',
            payload: response.data,
        });
    }
};