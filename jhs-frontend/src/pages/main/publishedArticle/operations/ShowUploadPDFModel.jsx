/* eslint-disable */
import React from 'react';

import { toggleModal } from 'helpers/globalHelpers';
import { getPublishedArticleDetail } from 'store/home/publishedArticle/actions';
import { useDispatch } from 'react-redux';

const ShowUploadPDFModel = ({ articleId, ActionType = 'dropdown' }) => {
        const dispatch = useDispatch();

        const handleAction = () => {
                dispatch(
                        getPublishedArticleDetail({
                                body: {},
                                options: { id: articleId, btnLoader: true, __module: "home" },
                        })
                );
                toggleModal('#showShowUploadPDFModel')
        };

        const type = ActionType === 'dropdown' ? 'dropdown-item' : ActionType;

        return (
                <div>
                        <button
                                key={`showShowUploadPDFModel` + articleId}
                                id={`showShowUploadPDFModel` + articleId}
                                className={`${type}`} onClick={() => handleAction()}>
                                <i className="ai-file me-2"></i> Upload PDF
                        </button>
                </div>
        );
};

export default ShowUploadPDFModel;