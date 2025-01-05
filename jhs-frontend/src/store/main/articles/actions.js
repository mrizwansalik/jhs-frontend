/* eslint-disable */
import fileDownload from 'js-file-download';
import { request } from '../../../helpers/request';
import { History } from '../../../routes/NavigationSetter';

export const getPublicArticles = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'all', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_ARTICLES', payload: response });
    }
};
export const getArticles = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'getAllArticle', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_ARTICLES', payload: response });
    }
};
export const getArticleReferencesTextList = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', `${payload.options.id}/getArticleReferencesTextList`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({
            type: 'SET_MY_ARTICLE_REFERENCES_TEXT_LIST',
            payload: response.data,
        });
    }
};
export const getMyPublishedArticle = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'getMyPublishedArticle', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_PUBLISHED_ARTICLES', payload: response });
    }
};

export const getDraftArticles = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'getAllDraftArticle', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_DRAFT_ARTICLES', payload: response });
    }
};
export const getDraftArticleReferencesTextList = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', `${payload.options.id}/getDraftArticleReferencesTextList`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({
            type: 'SET_MY_DRAFT_ARTICLE_REFERENCES_TEXT_LIST',
            payload: response.data,
        });
    }
};
export const getAssignedArticles = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'getAllAssignedArticles', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_ASSIGNED_ARTICLES', payload: response });
    }
};
export const getReviewArticles = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'getAllReviewerArticles', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_REVIEW_ARTICLES', payload: response });
    }
};
export const getArticle = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', `${payload.options.id}/getArticleDetail`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({
            type: 'SET_MY_ARTICLE',
            payload: response.data,
        });
    }
};
export const getDraftArticle = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', `${payload.options.id}/getDraftArticleDetail`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({
            type: 'SET_MY_DRAFT_ARTICLE',
            payload: response.data,
        });
    }
};
export const updateDraftArticle = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/update`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_DRAFT_ARTICLE', payload: response.data });
    }
};
export const getArticleAuthors = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', `${payload.options.id}/getArticleAuthors`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({
            type: 'SET_MY_ARTICLE_AUTHORS',
            payload: response.data,
        });
    }
};
export const getArticleReviewers = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', `${payload.options.id}/getArticleReviewers`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({
            type: 'SET_MY_ARTICLE_REVIEWER',
            payload: response.data,
        });
    }
};
export const getArticleEditor = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', `${payload.options.id}/getArticleEditor`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({
            type: 'SET_MY_ARTICLE_EDITOR',
            payload: response.data,
        });
    }
};
export const getArticleComment = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', `${payload.options.id}/getArticleComment`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({
            type: 'SET_MY_ARTICLE_COMMENTS',
            payload: response.data,
        });
    }
};
export const getArticleCommentReplies = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/getCommentReply`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({
            type: 'SET_MY_ARTICLE_COMMENT',
            payload: response.data,
        });
    }
};
export const addArticleComment = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/addComment`, payload.body, payload.options);
    return response;
};
export const addCommentReply = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/addCommentReply`, payload.body, payload.options);
};

export const getStarted = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', 'getStarted', payload.body, payload.options);
    if (response.status === 200) {
        History.navigate('/main/article/' + response.data._id + '/edit/title')
    }
};
export const updateArticle = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/update`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_ARTICLE', payload: response.data });
    }
};
export const addArticleTable = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/addTable`, payload.body, payload.options);
    if (response.status === 200) {
        payload?.editor.execute("insertData", { id: response.data.insertedId, data: payload.body })
        dispatch({ type: 'SET_MY_ARTICLE_TABLES', payload: response.data });
        dispatch(getDraftArticle({ body: {}, options: { id: payload.options.id, btnLoader: true, __module: 'article', } }));    //payload.options.id

    }
};
export const updateArticleTable = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/updateTable`, payload.body, payload.options);
    if (response.status === 200) {
        payload?.editor.execute("insertData", { id: response.data.updatedId, data: payload.body })
        dispatch({ type: 'SET_MY_ARTICLE_TABLES', payload: response.data });
        dispatch(getDraftArticle({ body: {}, options: { id: payload.options.id, btnLoader: true, __module: 'article', } }));    //payload.options.id

    }
};
export const deleteArticleTable = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/removeTable`, payload.body, payload.options);
    if (response.status === 200) {
        // dispatch({ type: 'SET_MY_ARTICLE_DELETED', payload: response.data });
        dispatch(getDraftArticle({ body: {}, options: { id: payload.options.id, btnLoader: true, __module: 'article', } }));    //payload.options.id
        payload?.editor.model.change(writer => {
            const root = payload?.editor.model.document.getRoot();
            const range = writer.createRangeIn(root);
            const itemsToRemove = [];

            for (const value of range.getWalker()) {
                //@fixme do r&d and find appropriate function to get ._attrs
                if (value.item.is("element", "tablePreview") && value?.item?._attrs?.get('id') === payload.body?.articleTableID) {

                    itemsToRemove.push(value.item);
                }
            }

            for (const item of itemsToRemove) {
                writer.remove(item); // remove all of the items.
            }

        });
    }

};

export const addArticleFigure = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/addFigure`, payload.body, payload.options);
    if (response.status === 200) {
        payload?.editor.execute("insertFigureData", { id: response.data.insertedId, data: payload.body })
        dispatch({ type: 'SET_MY_ARTICLE_TABLES', payload: response.data });
        dispatch(getDraftArticle({ body: {}, options: { id: payload.options.id, btnLoader: true, __module: 'article', } }));    //payload.options.id

    }
};
export const updateArticleFigure = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/updateFigure`, payload.body, payload.options);
    if (response.status === 200) {
        payload?.editor.execute("insertFigureData", { id: response.data.updatedId, data: payload.body })
        dispatch({ type: 'SET_MY_ARTICLE_TABLES', payload: response.data });
        dispatch(getDraftArticle({ body: {}, options: { id: payload.options.id, btnLoader: true, __module: 'article', } }));    //payload.options.id

    }
};
export const deleteArticleFigure = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/removeFigure`, payload.body, payload.options);
    if (response.status === 200) {
        // dispatch({ type: 'SET_MY_ARTICLE_DELETED', payload: response.data });
        dispatch(getDraftArticle({ body: {}, options: { id: payload.options.id, btnLoader: true, __module: 'article', } }));    //payload.options.id
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


export const validateArticle = (payload) => async (dispatch) => {
    try {
        const response = await request.makeRequest('PUT', `${payload.options.id}/validateArticle`, payload.body, payload.options);
        if (response.status === 200) {
            dispatch({ type: 'RESET_FORM_ERRORS' });
        }
    } catch (e) { }
};
export const submitArticle = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/submitArticle`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_ARTICLE', payload: response.data });
        History.navigate('/main/article/' + response.data._id + '/showArticle')
    }
};
export const deactivateArticle = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/deactivateArticle`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_ARTICLE_DELETED', payload: response.data });
    }
};
export const activateArticle = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/activateArticle`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_ARTICLE_DELETED', payload: response.data });
    }
};
export const deleteMyArticle = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/deleteMyArticle`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_ARTICLE_DELETED', payload: response.data });
    }
};
export const acceptArticleOnSubmission = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/acceptArticleOnSubmission`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_ARTICLE_PROCESSING', payload: response.data });
    }
};
export const payArticlePayment = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/payArticlePayment`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_ARTICLE_PROCESSING', payload: response.data });
    }
};
export const requestForArticleLanguageCorrection = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/requestArticleForLanguageCorrection`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_ARTICLE_PROCESSING', payload: response.data });
    }
};
export const acceptRequestForLanguageCorrection = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/acceptRequestForLanguageCorrection`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_ARTICLE_PROCESSING', payload: response.data });
    }
};
export const requestForRevision = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/requestForRevision`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_ARTICLE_PROCESSING', payload: response.data });
    }
};
export const approveRequestForRevision = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/approveRequestForRevision`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_ARTICLE_PROCESSING', payload: response.data });
    }
};
export const rejectRequestForRevision = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/rejectRequestForRevision`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_ARTICLE_PROCESSING', payload: response.data });
    }
};
export const submitRevision = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/submitRevision`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_ARTICLE_PROCESSING', payload: response.data });
    }
};

export const acceptArticleRevision = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/acceptArticleRevision`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_ARTICLE_PROCESSING', payload: response.data });
        History.navigate('/main/article/' + response.data._id + '/showArticle')
    }
};
export const rejectArticleRevision = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/rejectArticleRevision`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_ARTICLE_PROCESSING', payload: response.data });
        History.navigate('/main/article/' + response.data._id + '/showArticle')
    }
};

export const moveToLanguageCorrection = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/moveToLanguageCheck`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_ARTICLE_PROCESSING', payload: response.data });
    }
};

export const startLanguageCorrection = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/startLanguageCorrection`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_ARTICLE_PROCESSING', payload: response.data });
    }
};

export const completeLanguageCorrection = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/completeLanguageCorrection`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_ARTICLE_PROCESSING', payload: response.data });
    }
};
export const acceptLanguageCorrection = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/acceptArticleLanguageCorrection`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_ARTICLE_PROCESSING', payload: response.data });
        History.navigate('/main/article/' + response.data._id + '/showArticle')
    }
};
export const reviewLanguageCorrection = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/rejectArticleLanguageCorrection`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_ARTICLE_PROCESSING', payload: response.data });
        History.navigate('/main/article/' + response.data._id + '/showArticle')
    }
};

export const moveToLanguageCheck = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/moveToLanguageCheck`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_ARTICLE_PROCESSING', payload: response.data });
    }
};
export const acceptArticleFromLanguageCheck = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/acceptArticleFromLanguageCheck`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_ARTICLE_PROCESSING', payload: response.data });
    }
};
export const rejectArticleFromLanguageCheck = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/rejectArticleFromLanguageCheck`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_ARTICLE_PROCESSING', payload: response.data });
    }
};
export const acceptArticleFromPeerReview = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/acceptArticleFromPeerReview`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_ARTICLE_PROCESSING', payload: response.data });
    }
};
export const rejectArticleFromPeerReview = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/rejectArticleFromPeerReview`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_ARTICLE_PROCESSING', payload: response.data });
    }
};

export const acceptArticleFromGalleryProof = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/acceptArticleFromGalleryProof`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_ARTICLE_PROCESSING', payload: response.data });
    }
};
export const publishArticle = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/publishArticle`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'PUBLISH_ARTICLE', payload: response.data });
    }
};
export const getArticleActionHistory = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', `${payload.options.id}/getArticleActionHistory`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_ARTICLE_HISTORY', payload: response.data });
    }
};
export const exportCitation = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/exportCitation`, payload.body, payload.options);
    if (response.status === 200) {
        fileDownload(response.data, `citation.${payload.body.type}`);
    }
};