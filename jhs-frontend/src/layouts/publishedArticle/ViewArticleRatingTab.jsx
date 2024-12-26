/* eslint-disable  */
import React from 'react';
import { Link } from 'react-router-dom';

const ViewArticleRatingTab = ({ articleId }) => {

    return (
        <div className="m-4 border-bottom fs-5"
            style={{
                zIndex: 950,
            }}>
            <div className="d-flex justify-content-center">
                {/* Nav tabs */}
                <ul
                    className="nav nav-tabs card-header-tabs align-items-center mb-n1"
                    role="tablist"
                >
                    <li className="nav-item me-3" role="articles">
                        <Link
                            className={`nav-link px-0 py-2 border-0 rounded-1 ${location.pathname === `/published/article/rating/${articleId}/article` ? 'active' : ''} `}
                            to={`/published/article/rating/${articleId}/article`}
                        >
                            <i className="ai-home fs-lg opacity-90 me-2" />
                            Article Rating
                        </Link>
                    </li>
                    <li className="vr opacity-20 my-3 me-3" />
                    <li className="nav-item me-3" role="review">
                        <Link
                            className={`nav-link px-0 py-2 border-0 rounded-1 ${location.pathname === `/published/article/rating/${articleId}/authors` ? 'active' : ''} `}
                            to={`/published/article/rating/${articleId}/authors`}
                        >
                            <i className="ai-user opacity-90 me-2" />
                            Authors Rating
                        </Link>
                    </li>
                    <li className="vr opacity-20 my-3 me-3" />
                    <li className="nav-item me-3" role="review">
                        <Link
                            className={`nav-link px-0 py-2 border-0 rounded-1 ${location.pathname === `/published/article/rating/${articleId}/reviewers` ? 'active' : ''} `}
                            to={`/published/article/rating/${articleId}/reviewers`}
                        >
                            <i className="ai-file-text opacity-90 me-2" />
                            Reviewers Rating 
                        </Link>
                    </li>
                    <li className="vr opacity-20 my-3 me-3" />
                    <li className="nav-item me-3" role="review">
                        <Link
                            className={`nav-link px-0 py-2 border-0 rounded-1 ${location.pathname === `/published/article/rating/${articleId}/editor` ? 'active' : ''} `}
                            to={`/published/article/rating/${articleId}/editor`}
                        >
                            <i className="ai-server opacity-90 me-2" />
                            Editors Rating
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default ViewArticleRatingTab;