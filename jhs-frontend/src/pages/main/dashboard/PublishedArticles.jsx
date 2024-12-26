/* eslint-disable */
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import EmptyList from 'components/message/EmptyList';
import ShowUploadPDFModel from '../publishedArticle/operations/ShowUploadPDFModel';
import DownloadPDF from '../publishedArticle/operations/DownloadPDF';

const PublishedArticles = () => {
    const articles = useSelector((state) => state.publishedArticle);

    if (!articles.list || articles?.list?.length == 0) {
        return (
            <EmptyList>
                <EmptyList.Header>No Article Found</EmptyList.Header>
                <EmptyList.Body>You do not have any published articles. Would you like to start a new one?</EmptyList.Body>
                <EmptyList.Footer>
                    <Link className="btn btn-primary ms-auto mb-4 rounded" to="/main/article/getStarted">
                        Submit Article
                    </Link>
                </EmptyList.Footer>
            </EmptyList>
        );
    }

    return (
        <>
            {
                articles.list && articles?.list?.map((article) => {
                    return (
                        <section key={"article-view-" + article._id} className="card card-lifted shadow px-3 py-3 my-3" >
                            <article className="row g-0 border-0 pt-3">
                                <div className="col-12">
                                    <div className="card-body px-3 py-2">
                                        <div className="row mt-sm-n1 mb-0">
                                            <div className='col-10'>
                                                <h5 className='h5 mb-3'>
                                                    <Link to={"/published/article/" + article?._id + "/view"}>{article?.title ?? "Untitled Article"}</Link>
                                                </h5>
                                            </div>
                                            <div className='col-2'>
                                                <div className="d-flex flex-row-reverse mt-sm-n1 mb-0 mb-lg-1 mb-xl-3">
                                                    <a
                                                        data-bs-toggle="dropdown"
                                                        aria-haspopup="true"
                                                        aria-expanded="false"
                                                    >
                                                        <i className="fas fa-ellipsis-v text-primary"></i>
                                                    </a>
                                                    <div className="dropdown dropdown-menu dropdown-menu-end my-1">
                                                        <Link
                                                            key={"article_preview_" + article?._id}
                                                            id={"article_preview_" + article?._id}
                                                            className="dropdown-item" to={"/published/article/" + article?._id + "/view"}>
                                                            <i className="ai-show me-2"></i> Preview
                                                        </Link>
                                                        <DownloadPDF articleId={article?._id} articleView={article?.downloads ?? 0}/>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex flex-wrap align-items-center mt-n2">
                                            <div className="d-flex align-items-center me-3 text-capitalize">
                                                DOI :
                                            </div>
                                            <div className="d-flex align-items-end me-3">
                                                {article?.doi}
                                            </div>
                                        </div>
                                        <div className="d-flex flex-wrap align-items-center mt-2">
                                            <span className="badge border-primary text-primary fs-xs border mt-2">
                                                {article?.type}
                                            </span>
                                            <span className="fs-xs opacity-20 mt-2 mx-3">|</span>
                                            <span className="badge text-nav fs-xs border mt-2">
                                                <i className="ai-show fs-sm opacity-90 me-2" /> {article?.views ?? '0'}
                                            </span>
                                            <span className="badge text-nav fs-xs border mx-2 mt-2">
                                                <i className="ai-download fs-sm opacity-90 me-2" /> {article?.downloads ?? '0'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </section>
                    )
                })
            }
        </>
    );
};

export default PublishedArticles;