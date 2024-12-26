/* eslint-disable */
import React, { useEffect, useRef } from "react";

import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    deleteMyArticle,
    getArticle,
    getArticleActionHistory,
    getArticleEditor,
    getArticleAuthors,
    getArticleReviewers,
} from "../../../store/main/articles/actions";
import ArticleActions from "./operations/ArticleActions";
import ShowActionHistory from "./operations/ShowActionHistory";
import ArticleStatusName from "./operations/ArticleStatus";
import ActionHistoryModel from "./operations/ActionHistoryModel";
import { getAllArticleType } from "store/admin/articleType/actions";
import ExportCitation from "./operations/ExportCitation";
import ArticleCitationModel from "./operations/ArticleCitationModel";
import AddCommentModel from "./operations/AddCommentModel";
import ArticleCommentReplyModel from "./processing/ArticleCommentReplyModel";
import ArticleDiscussion from "./processing/ArticleDiscussion";
import ArticleDiscussionTab from "./processing/ArticleDiscussionTab";
import PublishArticleModel from "./operations/PublishArticleModel";

const ArticleProcessingChat = () => {
    const dispatch = useDispatch();
    let { articleId } = useParams();

    const articleInfo = useSelector((state) => state.article.single);
    const articleTypes = useSelector((state) => state.articleType.list);

    useEffect(() => {
        dispatch(getArticle({ body: {}, options: { id: articleId, btnLoader: true, __module: "article" } }));
        dispatch(getArticleAuthors({ body: {}, options: { id: articleId, btnLoader: true, __module: "article" } }));
        dispatch(getArticleReviewers({ body: {}, options: { id: articleId, btnLoader: true, __module: "article" } }));
        dispatch(getArticleEditor({ body: {}, options: { id: articleId, btnLoader: true, __module: "article" } }));
        dispatch(getArticleActionHistory({ body: {}, options: { id: articleId, btnLoader: true, __module: "article" } }));
        dispatch(getAllArticleType({ body: {}, options: { __module: "articleType" } }));
    }, [dispatch, articleId]);

    useEffect(() => {
        if (articleTypes?.length && articleInfo !== null) {
            let selectedArticle = articleTypes?.filter(
                (article) => article.name === articleInfo.type
            );
            dispatch({ type: "SELECTED_ARTICLE", payload: selectedArticle[0] });
        }
    }, [articleInfo, articleTypes]);

    const deleteArticleHandler = (id) => {
        dispatch(
            deleteMyArticle({
                body: {},
                options: {
                    id: id,
                    btnLoader: true,
                    __module: "article",
                    showToast: true,
                },
            })
        );
    };

    return (
        <div className="mx-4 px-4">
            <div className="card border-0 border-start border-4 border-primary rounded-4 mb-3">
                <div className="card-body">
                    <div className='row mt-sm-n1 mb-0'>
                        <div className='col-10'>
                            <h1 className="h2 fw-normal lh-base">
                                <span className="text-primary fw-semibold">{articleInfo?.title}</span>
                            </h1>
                            <div className="d-flex flex-wrap align-items-center mt-n2">
                                <a
                                    className="nav-link px-0 py-2 border-0 rounded-1 active"
                                    href="#preview1"
                                    data-bs-toggle="tab"
                                    role="tab"
                                    aria-controls="preview1"
                                    aria-selected="true"
                                >
                                    <ArticleStatusName taskState={articleInfo?.articleStatus?.slug} article={articleInfo} />
                                </a>
                                <span className="fs-xs opacity-20 mt-2 mx-3">|</span>
                                <span className="badge text-nav fs-xs border border-1 mt-2">
                                    {articleInfo?.type}
                                </span>
                            </div>
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

                                    <ArticleActions taskState={articleInfo?.articleStatus?.slug} articleId={articleInfo?._id} article={articleInfo} />
                                    <ShowActionHistory articleId={articleInfo?._id} />
                                    <ExportCitation articleId={articleInfo?._id} />

                                    <button
                                        key={"article_delete_" + articleInfo?._id}
                                        id={"article_delete_" + articleInfo?._id}
                                        className="dropdown-item" onClick={() => deleteArticleHandler(articleInfo?._id)}>
                                        <i className="ai-trash me-2"></i> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <section className="mt-2 mt-md-0 pb-5 mb-md-2 mb-lg-3 mb-xl-4 mb-xxl-5">
                <ArticleDiscussionTab articleId={articleId} />
                <ArticleDiscussion articleId={articleId} />
            </section>

            <ActionHistoryModel />
            <PublishArticleModel />

            <AddCommentModel articleId={articleInfo?._id} />

            <ArticleCitationModel articleId={articleInfo?._id} />
            <ArticleCommentReplyModel articleId={articleInfo?._id} />

            <ArticleCitationModel articleId={articleInfo?._id} />
        </div>
    );
};

export default ArticleProcessingChat;
