/* eslint-disable */
import React, { useEffect } from 'react';
import { Outlet, Link, useParams, useLocation } from 'react-router-dom';
import Header from '../../components/header/Header';
import Loading from '../../components/loading/Loading';
import Toasts from '../../components/Notification/Toasts';
import Footer from '../../components/footer/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/auth/actions';
import { getArticle } from '../../store/main/articles/actions';
import { getAllArticleType } from '../../store/admin/articleType/actions'
;
import BackToTop from 'components/BackToTop/BackToTop';

const ShowArticleLayout = () => {

    let { articleId } = useParams();

    const dispatch = useDispatch();
    const articleTypes = useSelector((state) => state.articleType.list);
    const articleInfo = useSelector((state) => state.article.single);
    
    useEffect(() => {
        const script = document.createElement('script');
        script.src = `${window.location.origin}/assets/js/theme.min.js`;
        script.async = true;
        document.body.appendChild(script);
        
        // get article detail
        dispatch(getArticle({ body: {}, options: { id: articleId, btnLoader: true, __module: 'article', } }));
        dispatch(getAllArticleType({ body: {}, options: { __module: 'articleType', } }));

        return () => {
            document.body.removeChild(script);
        }
    }, []);

    useEffect(() => {
        if (articleTypes?.length && articleInfo !== null) {
            let selectedArticle = articleTypes?.filter((article) => article.name === articleInfo.type);
            dispatch({ type: 'SELECTED_ARTICLE', payload: selectedArticle[0] });
        }
    }, [articleInfo,articleTypes]);

    const handleLogout = () => {
        dispatch(logout());
    };
    
    if (!articleInfo || !articleTypes) return ''
    return (
        <>
            <Loading />
            <Header />
            <main className="page-wrapper">
                <div className="container py-5 mt-5 mt-lg-5 mb-lg-4 my-xl-5" style={{ minHeight: '100vh' }}>
                    <div className="row pt-sm-2 pt-lg-0">
                        <aside className="col-lg-3 pe-lg-4 pe-xl-5 mt-n3">
                            <div className="position-lg-sticky top-0">
                                <div className="d-none d-lg-block" style={{ paddingTop: '50px' }} />
                                <div className="offcanvas-lg offcanvas-start" id="sidebarAccount">
                                    <button className="btn-close position-absolute top-0 end-0 mt-3 me-3 d-lg-none" type="button" data-bs-dismiss="offcanvas" data-bs-target="#sidebarAccount" />
                                    <div className="offcanvas-body">
                                        <div className="pb-2 pb-lg-0">
                                            <h4 className="h4">{ articleInfo?.type }</h4>
                                        </div>
                                        <li className="nav-item"><a className="nav-link fs-sm fw-normal py-1 ps-1 pe-0 mb-1" href="#type-headings" data-scroll="data-scroll">Headings</a></li>
                                        <li className="nav-item"><a className="nav-link fs-sm fw-normal py-1 ps-1 pe-0 mb-1" href="#type-headings" data-scroll="data-scroll">Headings</a></li>
                                        <nav className="nav flex-column"><button className="nav-link py-2 px-0" onClick={handleLogout}><i className="ai-logout fs-5 opacity-60 me-2" />Sign out</button></nav>
                                    </div>
                                </div>
                            </div>
                        </aside>
                        <Outlet />
                    </div>
                </div>
                <button className="d-lg-none btn btn-sm fs-sm btn-primary w-100 rounded-0 fixed-bottom" data-bs-toggle="offcanvas" data-bs-target="#sidebarAccount"><i className="ai-menu me-2"></i>Menu</button>
            </main>
            <BackToTop />
            <Toasts />
            <Footer />
        </>
    );
};

export default ShowArticleLayout;
