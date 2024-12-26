/* eslint-disable */
import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { deleteMyArticle } from '../../../store/main/articles/actions';
import EmptyList from 'components/message/EmptyList';

const DraftArticle = () => {
    const dispatch = useDispatch();
    const articles = useSelector((state) => state.article);

    const deleteArticleHandler = (id) => {
        dispatch(
            deleteMyArticle({
                body: {},
                options: { id: id, btnLoader: true, __module: 'article', showToast: true },
            }));
    }

    if (!articles.draftList || articles?.draftList?.length == 0) {
        return (
            <EmptyList>
                <EmptyList.Header>No Draft Found</EmptyList.Header>
                <EmptyList.Body>You do not have any article in draft. Would you like to start a new one?</EmptyList.Body>
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
            {articles.draftList && articles?.draftList?.map((article) => {
                return (
                    <section key={"article-view-" + article._id} className="card card-lifted shadow px-3 py-3 my-3" >
                        <article className="row g-0 border-0 pt-3">
                            <div className="col-12">
                                <div className="card-body px-3 py-2">
                                    <div className="row mt-sm-n1 mb-0">
                                        <div className='col-10'>
                                            <h5 className='h5 mb-3'>
                                                {article?.title ?? "Untitled Article"}
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
                                                    {
                                                        article?.isEditable === true ?
                                                        (
                                                            <Link
                                                                key={"article_edit_" + article?._id}
                                                                id={"article_edit_" + article?._id}
                                                                className="dropdown-item" to={"/main/article/" + article?._id + "/edit/title"}>
                                                                <i className="ai-edit me-2"></i> Edit Article
                                                            </Link>
                                                        ) : ( <></>)
                                                    }
                                                    <button
                                                        key={"article_delete_" + article?._id}
                                                        id={"article_delete_" + article?._id}
                                                        className="dropdown-item" onClick={() => deleteArticleHandler(article?._id)}>
                                                        <i className="ai-trash me-2"></i> Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-wrap align-items-center mt-n2">
                                        <a
                                            className="nav-link px-0 py-2 border-0 rounded-1 active"
                                            href="#preview1"
                                            data-bs-toggle="tab"
                                            role="tab"
                                            aria-controls="preview1"
                                            aria-selected="true"
                                        >
                                            {article?.articleStatus?.name ? <><strong className='text-primary'><i className="ai-bookmark fs-lg opacity-90 me-2" />{article?.articleStatus?.name}</strong></> : <><i className="ai-bookmark fs-lg opacity-90 me-2" /> Draft</>}
                                        </a>
                                        <span className="fs-xs opacity-20 mt-2 mx-3">|</span>
                                        <span className="badge text-nav fs-xs border mt-2">
                                            {article?.type}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </section>
                );
            })}
        </>
    );
};

export default DraftArticle;