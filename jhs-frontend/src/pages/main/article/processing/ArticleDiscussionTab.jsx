/* eslint-disable  */
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ArticleDiscussionTab = ({articleId}) => {

    return (
        <div className="m-4 border-bottom"
        style={{
            zIndex: 950,
        }}>
            <div className="d-flex align-items-center">
                {/* Nav tabs */}
                <ul
                    className="nav nav-tabs card-header-tabs align-items-center mb-n1"
                    role="tablist"
                >
                    <li className="nav-item me-3" role="articles">
                        <Link
                            className={`nav-link px-0 py-2 border-0 rounded-1 ${location.pathname === `/main/article/${articleId}/process` ? 'active' : ''} `}
                            to={`/main/article/${articleId}/process`}
                        >
                        <i className="ai-home fs-lg opacity-90 me-2" />
                        Article Detail
                        </Link>
                    </li>
                    <li className="vr opacity-20 my-3 me-3" />
                    <li className="nav-item me-3" role="review">
                        <Link
                            className={`nav-link px-0 py-2 border-0 rounded-1 ${location.pathname ===  `/main/article/${articleId}/process/chat` ? 'active' : ''} `}
                            to={`/main/article/${articleId}/process/chat`}
                        >
                        <i className="ai-checks fs-xl opacity-90 me-2" />
                        Discussion<span className="badge border border-primary text-primary ms-2">0</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default ArticleDiscussionTab;