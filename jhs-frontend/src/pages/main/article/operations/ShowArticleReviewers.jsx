/* eslint-disable */
import React from 'react';

import { toggleModal } from 'helpers/globalHelpers';
import { getUnassignedUser } from 'store/main/articleUser/actions';
import { useDispatch } from 'react-redux';

const ShowArticleReviewers = ({ articleId }) => {

        const dispatch = useDispatch();
        const handleAction = () => {
                dispatch(getUnassignedUser({ body: {}, options: { id: articleId, btnLoader: true, __module: 'article', } }));
                toggleModal('#showArticleReviewerModel')
        };

        return (
                <div key={`ArticleReviewers${articleId}`}>
                        <p className="fs-sm fw-semibold">
                                <span
                                        key={`ShowArticleReviewers` + articleId}
                                        id={`ShowArticleReviewers` + articleId}
                                        className={`text-decoration-none text-primary text-nowrap`} onClick={() => handleAction()}>
                                        Show Reviewers <i className="ai-external-link me-2"></i>
                                </span>
                        </p>
                </div>
        );
};

export default ShowArticleReviewers;