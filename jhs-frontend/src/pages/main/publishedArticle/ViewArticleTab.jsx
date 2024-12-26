/* eslint-disable  */
import React from 'react';
import { Link } from 'react-router-dom';

const ViewArticleTab = ({ articleId }) => {

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
                            className={`nav-link px-0 py-2 border-0 rounded-1 ${location.pathname === `/published/article/${articleId}/view` ? 'active' : ''} `}
                            to={`/published/article/${articleId}/view`}
                        >
                            <i className="ai-home fs-lg opacity-90 me-2" />
                            Article
                        </Link>
                    </li>
                    <li className="vr opacity-20 my-3 me-3" />
                    <li className="nav-item me-3" role="review">
                        <Link
                            className={`nav-link px-0 py-2 border-0 rounded-1 ${location.pathname === `/published/article/${articleId}/view/authors` ? 'active' : ''} `}
                            to={`/published/article/${articleId}/view/authors`}
                        >
                            <i className="ai-user opacity-90 me-2" />
                            Authors
                        </Link>
                    </li>
                    <li className="vr opacity-20 my-3 me-3" />
                    <li className="nav-item me-3" role="review">
                        <Link
                            className={`nav-link px-0 py-2 border-0 rounded-1 ${location.pathname === `/published/article/${articleId}/view/metrics` ? 'active' : ''} `}
                            to={`/published/article/${articleId}/view/metrics`}
                        >
                            <i className="ai-file-text opacity-90 me-2" />
                            Metrics
                        </Link>
                    </li>
                    <li className="vr opacity-20 my-3 me-3" />
                    <li className="nav-item me-3" role="review">
                        <Link
                            className={`nav-link px-0 py-2 border-0 rounded-1 ${location.pathname === `/published/article/${articleId}/view/media` ? 'active' : ''} `}
                            to={`/published/article/${articleId}/view/media`}
                        >
                            <i className="ai-server opacity-90 me-2" />
                            Media
                        </Link>
                    </li>
                    <li className="vr opacity-20 my-3 me-3" />
                    <li className="nav-item me-3" role="review">
                        <Link
                            className={`nav-link px-0 py-2 border-0 rounded-1 ${location.pathname === `/published/article/${articleId}/view/rating` ? 'active' : ''} `}
                            to={`/published/article/${articleId}/view/rating`}
                        >
                            <i className="ai-star opacity-90 me-2" />
                            Rating
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default ViewArticleTab;