/* eslint-disable */
import React from "react";

import { toggleModal } from "helpers/globalHelpers";

const ShowArticleAuthors = ({ articleId }) => {
        const handleAction = () => {
                toggleModal("#showArticleAuthorModel");
        };

        return (
                <div key={`ArticleAuthors${articleId}`}>
                        <p className="fs-sm fw-semibold" onClick={() => handleAction()}>
                                <span
                                        key={`ShowArticleAuthors` + articleId}
                                        id={`ShowArticleAuthors` + articleId}
                                        className={`text-decoration-none text-primary text-nowrap`}
                                >
                                        Show Author <i className="ai-external-link me-2"></i>
                                </span>
                        </p>
                </div>
        );
};

export default ShowArticleAuthors;
