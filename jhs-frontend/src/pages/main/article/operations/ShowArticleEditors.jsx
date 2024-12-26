/* eslint-disable */
import React from 'react';

import { toggleModal } from 'helpers/globalHelpers';
import { getUnassignedUser } from 'store/main/articleUser/actions';
import { useDispatch } from 'react-redux';

const ShowArticleEditors = ({ articleId }) => {

        const dispatch = useDispatch();

        const handleAction = () => {
                dispatch(getUnassignedUser({ body: {}, options: { id: articleId, btnLoader: true, __module: 'article', } }));
                toggleModal('#showArticleEditorsModel')
        };

        return (
                <div key={`ArticleEditors${articleId}`}>
                        <p className="fs-sm fw-semibold">
                                <span
                                        key={`ShowArticleEditors` + articleId}
                                        id={`ShowArticleEditors` + articleId}
                                        className={`text-decoration-none text-primary text-nowrap`} onClick={() => handleAction()}>
                                        Show Editor <i className="ai-external-link me-2"></i>
                                </span>
                        </p>
                </div>
        );
};

export default ShowArticleEditors;