/* eslint-disable  */
import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    deleteMyArticle,
} from '../../../store/main/articles/actions';
import ArticleActions from '../article/operations/ArticleActions';
import ArticleStatusName from '../article/operations/ArticleStatus';
import ShowActionHistory from '../article/operations/ShowActionHistory';
import EmptyList from 'components/message/EmptyList';

const ReviewArticle = () => {
    const dispatch = useDispatch();
    const articles = useSelector((state) => state.article.reviewList);

    const deleteArticleHandler = (id) => {
        dispatch(
            deleteMyArticle({
                body: {},
                options: { id: id, btnLoader: true, __module: 'article', showToast: true },
            }));
    }

    if (!articles || articles?.length == 0) {
        return (
            <EmptyList>
                <EmptyList.Header>No Article Found In Review</EmptyList.Header>
                <EmptyList.Body>You do not have any articles to review.</EmptyList.Body>
                <EmptyList.Footer>
                    <Link
                        className={`btn btn-lg btn-primary`}
                        to={"/main/dashboard"}
                    >
                        <i className="ai-home fs-lg opacity-90 me-2" />
                        Go to Dashboard
                    </Link>
                </EmptyList.Footer>
            </EmptyList>
        );
    }

    return (
        <>
            {articles && articles?.map((article) => {
                return (
                    <section key={"article-view-" + article._id} className="card card-lifted shadow px-3 py-3 my-3" >
                        <article className="row g-0 border-0 pt-3">
                            <div className="col-12">
                                <div className="card-body px-3 py-2">
                                    <div className="row mt-sm-n1 mb-0">
                                        <div className='col-10'>
                                            <h5 className='h5 mb-3'>
                                                <Link to={"/main/article/" + article?._id + "/process"}>{article?.title ?? "Untitled Article"}</Link>
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
                                                        className="dropdown-item" to={"/main/article/" + article?._id + "/showArticle"}>
                                                        <i className="ai-show me-2"></i> Preview
                                                    </Link>

                                                    <Link
                                                        key={"article_discussion_" + article?._id}
                                                        id={"article_discussion_" + article?._id}
                                                        className="dropdown-item" to={"/main/article/" + article?._id + "/process"}>
                                                        <i className="ai-message me-2"></i> Discussion
                                                    </Link>

                                                    <ArticleActions taskState={article?.articleStatus?.slug} articleId={article?._id} article={article} />

                                                    <ShowActionHistory articleId={article?._id} />

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
                                            <ArticleStatusName taskState={article?.articleStatus?.slug} article={article} />
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
                )
            })}
        </>
    );
};

export default ReviewArticle;