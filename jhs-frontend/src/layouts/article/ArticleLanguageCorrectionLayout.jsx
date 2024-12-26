/* eslint-disable */
import React, { useEffect } from 'react';
import { Outlet, Link, useParams, useLocation } from 'react-router-dom';
import Header from '../../components/header/Header';
import Loading from '../../components/loading/Loading';
import Toasts from '../../components/Notification/Toasts';
import Footer from '../../components/footer/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { getAllArticleType } from '../../store/admin/articleType/actions';
import BackToTop from 'components/BackToTop/BackToTop';
import { getArticleLanguageCorrection } from 'store/main/articlesLanguageCorrection/actions';

const ArticleLanguageCorrectionLayout = () => {

    let { articleId } = useParams();
    const dispatch = useDispatch();
    const location = useLocation();
    const selectedArticleType = useSelector((state) => state.articleType.selected);
    const articleTypes = useSelector((state) => state.articleType.list);
    const articleInfo = useSelector((state) => state.articleLanguageCorrection.single);

    useEffect(() => {

        const script = document.createElement('script');
        script.src = `${window.location.origin}/assets/js/theme.min.js`;
        script.async = true;
        document.body.appendChild(script);
        
        // get article detail
        dispatch(getArticleLanguageCorrection({ body: {}, options: { id: articleId, btnLoader: true, __module: 'articleLanguageCorrection', } }));
        dispatch(getAllArticleType({ body: {}, options: { __module: 'articleType', } }));

        return () => {
            document.body.removeChild(script);
        }
    }, []);

    useEffect(() => {
        if (articleTypes?.length && articleInfo !== null) {
            let selectedArticle = articleTypes?.filter((article) => article.name === articleInfo?.type);
            dispatch({ type: 'SELECTED_ARTICLE', payload: selectedArticle[0] });
        }
    }, [articleInfo, articleTypes]);

    if (!articleInfo || !articleTypes) {
        // return null;
    }

    return (
        <>
            <Loading />
            <Header />
            <main className="page-wrapper">
                <div className="container py-5 mt-4 mt-lg-5 mb-lg-4 my-xl-5" style={{ minHeight: '100vh' }}>
                    <div className="row pt-sm-2 pt-lg-0">
                        <aside className="col-lg-3 pe-lg-4 pe-xl-5 mt-n3">
                            <div className="position-lg-sticky top-0">
                                <div className="d-none d-lg-block" style={{ paddingTop: '105px' }} />
                                <div className="offcanvas-lg offcanvas-start" id="sidebarAccount">
                                    <button className="btn-close position-absolute top-0 end-0 mt-3 me-3 d-lg-none" type="button" data-bs-dismiss="offcanvas" data-bs-target="#sidebarAccount" />
                                    <div className="offcanvas-body">
                                        <div className="pb-2 pb-lg-0">
                                            <h4 className="h4">{articleInfo?.type}</h4>
                                        </div>
                                        <li className="nav flex-column pb-1 mb-1">
                                            <span className="nav-link px-0 py-1"><i className="ai-grid fs-lg opacity-90 me-2"></i>Title Page</span>
                                            <ul className="nav flex-column border-start ps-3 ms-2 mb-2">
                                                <li className="nav-item"><Link className={`nav-link fs-sm fw-normal py-0 ps-1 pe-0 mb-1 ${location.pathname === `/main/article/${articleId}/languageCorrection/title` ? 'active' : ''} `} to={"/main/article/" + articleId + "/languageCorrection/title"} data-scroll="data-scroll">Title</Link></li>
                                                <li className="nav-item"><Link className={`nav-link fs-sm fw-normal py-0 ps-1 pe-0 mb-1 ${location.pathname === `/main/article/${articleId}/languageCorrection/category` ? 'active' : ''} `} to={"/main/article/" + articleId + "/languageCorrection/category"} data-scroll="data-scroll">Category</Link></li>
                                                <li className="nav-item"><Link className={`nav-link fs-sm fw-normal py-0 ps-1 pe-0 mb-1 ${location.pathname === `/main/article/${articleId}/languageCorrection/abstract` ? 'active' : ''}`} to={"/main/article/" + articleId + "/languageCorrection/abstract"} data-scroll="data-scroll">Abstract</Link></li>
                                                <li className="nav-item"><Link className={`nav-link fs-sm fw-normal py-0 ps-1 pe-0 mb-1 ${location.pathname === `/main/article/${articleId}/languageCorrection/keyword` ? 'active' : ''} `} to={"/main/article/" + articleId + "/languageCorrection/keyword"} data-scroll="data-scroll">Keywords</Link></li>
                                            </ul>
                                        </li>
                                        <li className="nav flex-column pb-1 mb-1">
                                            <span className="nav-link px-0 py-1"><i className="ai-file-text fs-lg opacity-90 me-2"></i>Article</span>
                                            <ul className="nav flex-column border-start ps-3 ms-2 mb-2">
                                                {selectedArticleType?.elements?.map((item) => {
                                                    return (
                                                        <li className="nav-item" key={"pageLink" + item}><Link className={`nav-link text-capitalize fs-sm fw-normal py-0 ps-1 pe-0 mb-1 ${location.pathname === `/main/article/${articleId}/languageCorrection/${item}` ? 'active' : ''}`} to={`/main/article/${articleId}/languageCorrection/${item}`} data-scroll="data-scroll">{item.replace("_", " ")}</Link></li>
                                                    )
                                                })}
                                            </ul>
                                        </li>
                                        <li className="nav flex-column pb-1 mb-1">
                                            <Link className={`nav-link px-0 py-1 ${location.pathname === `/main/article/${articleId}/languageCorrection/reference` ? 'active' : ''}`} to={"/main/article/" + articleId + "/languageCorrection/reference"}><i className="ai-list fs-lg opacity-90 me-2"></i>References</Link>
                                        </li>
                                        <li className="nav flex-column pb-1 mb-1">
                                            <Link className={`nav-link px-0 py-1 ${location.pathname === `/main/article/${articleId}/languageCorrection/summary` ? 'active' : ''}`} to={"/main/article/" + articleId + "/languageCorrection/summary"}><i className="ai-align-justify fs-lg opacity-90 me-2"></i>Summary</Link>
                                        </li>
                                        <li className="nav flex-column pb-1 mb-1">
                                            <Link className={`nav-link px-0 py-1 ${location.pathname === `/main/article/${articleId}/languageCorrection/submit` ? 'active' : ''}`} to={"/main/article/" + articleId + "/languageCorrection/submit"}><i className="ai-checks fs-lg opacity-90 me-2"></i>Submit</Link>
                                        </li>
                                    </div>
                                </div>
                            </div>
                        </aside>
                        {/* Main Content goes here */}
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

export default ArticleLanguageCorrectionLayout;
