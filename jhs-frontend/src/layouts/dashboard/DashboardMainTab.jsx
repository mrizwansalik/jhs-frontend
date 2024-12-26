/* eslint-disable  */
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const DashboardMainTab = () => {

    const articlesReviewList = useSelector((state) => state.article.reviewList);
    const taskList = useSelector((state) => state.task.list);

    return (
        <div className="border-bottom">
            <div className="d-flex align-items-center">
                {/* Nav tabs */}
                <ul
                    className="nav nav-tabs card-header-tabs align-items-center mb-n1"
                    role="tablist"
                >
                    <li className="nav-item me-3" role="articles">
                        <Link
                            className={`nav-link px-0 py-2 border-0 rounded-1 ${location.pathname === `/main/dashboard` || location.pathname === `/main/dashboard/article/publish`  || location.pathname === `/main/dashboard/article/assigned` || location.pathname === `/main/dashboard/article/draft` ? 'active' : ''} `}
                            to={"/main/dashboard"}
                        >
                        <i className="ai-home fs-lg opacity-90 me-2" />
                        My Article
                        </Link>
                    </li>
                    <li className="vr opacity-20 my-3 me-3" />
                    <li className="nav-item me-3" role="review">
                        <Link
                            className={`nav-link px-0 py-2 border-0 rounded-1 ${location.pathname === `/main/dashboard/review` ? 'active' : ''} `}
                            to={"/main/dashboard/review"}
                        >
                        <i className="ai-checks fs-xl opacity-90 me-2" />
                        My Reviews <span className="badge border border-primary text-primary ms-2">{articlesReviewList.length}</span>
                        </Link>
                    </li>
                    <li className="vr opacity-20 my-3 me-3" />
                    <li className="nav-item me-3" role="task">
                        <Link
                            className={`nav-link px-0 py-2 border-0 rounded-1 ${location.pathname === `/main/dashboard/task` ? 'active' : ''} `}
                            to={"/main/dashboard/task"}
                        >
                        <i className="ai-checks fs-xl opacity-90 me-2" />
                        My Task <span className="badge border border-primary text-primary ms-2">{taskList.length}</span>
                        </Link>
                    </li>
                    <li className="vr opacity-20 my-3 me-3" />
                    <li className="nav-item me-3" role="metrics">
                        <Link
                            className={`nav-link px-0 py-2 border-0 rounded-1 ${location.pathname === `/main/dashboard/metrics` ? 'active' : ''} `}
                            to={"/main/dashboard/metrics"}
                        >
                            <i className="ai-file opacity-90 me-2" />
                            Metric
                        </Link>
                    </li>
                </ul>
                <Link className="btn btn-primary ms-auto mb-4 rounded" to="/main/article/getStarted">
                    Submit Article
                </Link>
            </div>
        </div>
    );
};

export default DashboardMainTab;