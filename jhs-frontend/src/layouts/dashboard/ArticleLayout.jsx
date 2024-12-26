/* eslint-disable  */
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Header from '../../components/header/Header';
import Loading from '../../components/loading/Loading';
import Toasts from '../../components/Notification/Toasts';
import Footer from '../../components/footer/Footer';
import BackToTop from '../../components/BackToTop/BackToTop';

import { getArticles, getDraftArticles, getAssignedArticles, getReviewArticles, getMyPublishedArticle } from '../../store/main/articles/actions';
import { getAllTask } from 'store/main/task/actions';

import ArticleSidebar from '../../pages/main/dashboard/ArticleSidebar';
import ActionHistoryModel from '../../pages/main/article/operations/ActionHistoryModel';
import DashboardMainTab from './DashboardMainTab';
import DashboardArticleTab from './DashboardArticleTab';
import PublishArticleModel from 'pages/main/article/operations/PublishArticleModel';

const ArticleLayout = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `${window.location.origin}/assets/js/theme.min.js`;
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        }
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(getArticles({body: {},options: { __module: 'article' }}));
        dispatch(getMyPublishedArticle({body: {},options: { __module: 'articlePublished' }}));
        dispatch(getDraftArticles({body: {},options: { __module: 'article' }}));
        dispatch(getAssignedArticles({body: {},options: { __module: 'article' }}));
        dispatch(getReviewArticles({body: {},options: { __module: 'article' }}));
        dispatch(getAllTask({body: {},options: { __module: 'task' }}));
    }, [dispatch]);

    return (

        <div >
            <Loading />
            <main className="page-wrapper" style={{ minHeight: '100vh' }}>
                {/* Navbar. Remove 'fixed-top' class to make the navigation bar scrollable with the page*/}
                <Header />
                {/* Page content*/}
                <div className="container pt-5 pb-lg-5 pb-md-4 pb-2 my-5">
                    {/* Main Content goes here */}
                    <section className="border-0 mb-4" id="type-inline">
                    <DashboardMainTab />
                    {/* Tabs content */}
                    <div className="tab-content">
                        <div className="tab-pane fade active show" id="articles" role="tabpanel">
                            <div className='row'>
                                <div className="col-lg-3 pt-4 pb-2 pb-sm-4">
                                    <ArticleSidebar />
                                </div>
                                <div className="col-lg-9 pt-4 pb-2 pb-sm-4">
                                    <section className="border-0 mb-4" id="type-inline">
                                        <DashboardArticleTab />
                                        {/* Tabs content */}
                                        <div className="tab-content">
                                            <div className="tab-pane fade active show" >
                                                <Outlet  />
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <ActionHistoryModel />
                <PublishArticleModel />
                </div>
            </main>
            <BackToTop />
            <Toasts />
            <Footer />
        </div>
    );
};

export default ArticleLayout;