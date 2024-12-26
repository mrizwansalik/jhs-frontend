/* eslint-disable  */
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const DashboardArticleTab = () => {

    const articles = useSelector((state) => state.article.list);
    const articlesPublishedList = useSelector((state) => state.article.publishList);
    const articlesDraftList = useSelector((state) => state.article.draftList);
    const articlesAssignList = useSelector((state) => state.article.assignList);
    
    return (
        <div className="border-bottom">
            <div className="d-flex align-items-center">
                {/* Nav tabs */}
                <ul
                    className="nav nav-tabs card-header-tabs align-items-center mb-n1"
                    role="tablist"
                >
                    <li className="nav-item me-3" role="activeArticle">
                        <Link
                            className={`nav-link px-0 py-2 border-0 rounded-1 ${location.pathname === `/main/dashboard` ? 'active' : ''} `}
                            to={"/main/dashboard"}
                        >
                            <i className="ai-home fs-lg opacity-90 me-2" />
                            Active <span className="badge border border-primary text-primary ms-2">{articles.length}</span>
                        </Link>
                    </li>
                    <li className="vr opacity-20 my-3 me-3" />
                    <li className="nav-item me-3" role="publishedArticle">
                        <Link
                            className={`nav-link px-0 py-2 border-0 rounded-1 ${location.pathname === `/main/dashboard/article/publish` ? 'active' : ''} `}
                            to={"/main/dashboard/article/publish"}
                        >
                            <i className="ai-award fs-xl opacity-90 me-2" />
                            Published <span className="badge border border-primary text-primary ms-2">{articlesPublishedList.length}</span>
                        </Link>
                    </li>
                    <li className="vr opacity-20 my-3 me-3" />
                    <li className="nav-item me-3" role="assignedArticle">
                        <Link
                            className={`nav-link px-0 py-2 border-0 rounded-1 ${location.pathname === `/main/dashboard/article/assigned` ? 'active' : ''} `}
                            to={"/main/dashboard/article/assigned"}
                        >
                            <i className="ai-clock opacity-90 me-2" />
                            Assigned <span className="badge border border-primary text-primary ms-2">{articlesAssignList.length}</span>
                        </Link>
                    </li>
                    <li className="vr opacity-20 my-3 me-3" />
                    <li className="nav-item me-3" role="draftArticle">
                        <Link
                            className={`nav-link px-0 py-2 border-0 rounded-1 ${location.pathname === `/main/dashboard/article/draft` ? 'active' : ''} `}
                            to={"/main/dashboard/article/draft"}
                        >
                            <i className="ai-archive opacity-90 me-2" />
                            Draft <span className="badge border border-primary text-primary ms-2">{articlesDraftList.length}</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default DashboardArticleTab;