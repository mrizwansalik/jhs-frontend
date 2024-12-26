/* eslint-disable */
import React, { Fragment, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import parse from "html-react-parser";
import { useDispatch, useSelector } from 'react-redux';
import { deleteMyArticle, getArticle, getArticleActionHistory, getArticleEditor, getArticleAuthors, getArticleComment, getArticleReviewers, getArticleReferencesTextList } from '../../../store/main/articles/actions';
import ArticleActions from './operations/ArticleActions';
import ShowActionHistory from './operations/ShowActionHistory';
import ArticleStatusName from './operations/ArticleStatus';
import ActionHistoryModel from './operations/ActionHistoryModel';
import { getAllArticleType } from 'store/admin/articleType/actions';
import ArticleEditorsModel from './operations/ArticleEditorsModel';
import ShowArticleEditors from './operations/ShowArticleEditors';
import ShowArticleReviewers from './operations/ShowArticleReviewers';
import ArticleReviewerModel from './operations/ArticleReviewerModel';
import ArticleAuthorModel from './operations/ArticleAuthorModel';
import ShowArticleAuthors from './operations/ShowArticleAuthors';
import moment from 'moment';
import { getArticleUserInfo, getArticleUserTitle } from 'helpers/globalHelpers';
import ExportCitation from './operations/ExportCitation';
import ArticleCitationModel from './operations/ArticleCitationModel';
import ArticleFigureView from './preview/ArticleFigureView';
import ArticleTableView from "./preview/ArticleTableView";
import PublishArticleModel from './operations/PublishArticleModel';

const ArticleInformation = () => {
    const dispatch = useDispatch();
    let { articleId } = useParams();
    const articleInfo = useSelector((state) => state.article.single);
    const singleReferencesTextList = useSelector((state) => state.article.singleReferenceTextList);
    const authorList = useSelector((state) => state.article.singleAuthorList);
    const articleTypes = useSelector((state) => state.articleType.list);
    const selectedArticleType = useSelector((state) => state.articleType.selected);
    const comments = useSelector((state) => state.article.comments);

    const articleHistory = useSelector((state) => state.article.singleHistory);

    useEffect(() => {
        dispatch(getArticle({ body: {}, options: { id: articleId, btnLoader: true, __module: 'article', } }));
        dispatch(getArticleReferencesTextList({ body: {}, options: { id: articleId, btnLoader: true, __module: 'article', } }));
        dispatch(getArticleAuthors({ body: {}, options: { id: articleId, btnLoader: true, __module: 'article', } }));
        dispatch(getArticleReviewers({ body: {}, options: { id: articleId, btnLoader: true, __module: 'article', } }));
        dispatch(getArticleEditor({ body: {}, options: { id: articleId, btnLoader: true, __module: 'article', } }));
        dispatch(getArticleComment({ body: {}, options: { id: articleId, btnLoader: true, __module: 'article', } }));
        dispatch(getArticleActionHistory({ body: {}, options: { id: articleId, btnLoader: true, __module: 'article', } }));
        dispatch(getAllArticleType({ body: {}, options: { __module: 'articleType', } }));
    }, [dispatch, articleId]);

    useEffect(() => {
        if (articleTypes?.length && articleInfo !== null) {
            let selectedArticle = articleTypes?.filter((article) => article.name === articleInfo.type);
            dispatch({ type: 'SELECTED_ARTICLE', payload: selectedArticle[0] });
        }
    }, [articleInfo, articleTypes]);

    const calcPreviousTableCount = (currentArticleType) => {
        let arr = []
        let pageIndex = selectedArticleType?.elements.indexOf(currentArticleType); // 1
        for (let i = pageIndex - 1; i >= 0; i--) {
            let data = articleInfo?.article_data_id?.[selectedArticleType?.elements[i]]
            if (data) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = data;
                const dataIdArray = [];
                // const elementsWithDataId = tempDiv.querySelectorAll('[data-id]');
                const elementsWithDataId = tempDiv.querySelectorAll('[data-id][widget-type=table]');
                elementsWithDataId.forEach(element => {
                    dataIdArray.push(element.getAttribute('data-id'));
                });
                arr = [...arr, ...dataIdArray]
            }
        }
        return arr.length
    }
    const calcPreviousFigureCount = (currentArticleType) => {
        let arr = []
        let pageIndex = selectedArticleType?.elements.indexOf(currentArticleType); // 1
        for (let i = pageIndex - 1; i >= 0; i--) {
            let data = articleInfo?.article_data_id?.[selectedArticleType?.elements[i]]
            if (data) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = data;
                const dataIdArray = [];
                // const elementsWithDataId = tempDiv.querySelectorAll('[data-id]');
                const elementsWithDataId = tempDiv.querySelectorAll('[data-id][widget-type=figure]');
                elementsWithDataId.forEach(element => {
                    dataIdArray.push(element.getAttribute('data-id'));
                });
                arr = [...arr, ...dataIdArray]
            }
        }
        return arr.length
    }


    const htmlContentParser = (htmlString, item) => {

        let data = htmlString == undefined ? '<p></p>' : htmlString;

        let tableCount = calcPreviousTableCount(item);
        let figureCount = calcPreviousFigureCount(item);

        const parsedHtml = parse(data, {
            replace: (node, index) => {
                if (
                    node.type === "tag" &&
                    node.name === "section" &&
                    node.attribs["data-id"] &&
                    node.attribs["widget-type"] === "table"
                ) {
                    tableCount++
                    const dataId = node.attribs["data-id"];
                    let tableData = articleInfo.article_data_id.table_list.find(({ _id }) => _id === dataId);
                    if (tableData) {
                        return <ArticleTableView tableData={tableData} tableNo={tableCount} />
                    }
                }

                if (
                    node.type === "tag" &&
                    node.name === "section" &&
                    node.attribs["data-id"] &&
                    node.attribs["widget-type"] === "figure"
                ) {
                    figureCount++
                    const dataId = node.attribs["data-id"];
                    let figureData = articleInfo.article_data_id.figures_list.find(({ _id }) => _id === dataId);
                    if (figureData) {
                        return <ArticleFigureView figureData={figureData} figureNo={figureCount} />
                    }
                }
                return undefined
            }
        });
        return <div>{parsedHtml}</div>
    }

    const deleteArticleHandler = (id) => {
        dispatch(
            deleteMyArticle({
                body: {},
                options: { id: id, btnLoader: true, __module: 'article', showToast: true },
            }));
    }

    return (
        <>
            <div className="row">
                <div className='col-12 mt-3 mb-0'>
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
                </div>
            </div>
            <div className="row">
                <div className="col-lg-3 col-md-6 mb-4">
                    <div className="h-100 bg-white rounded-3 shadow border-1 text-center p-4">
                        <h2 className="h6 pb-2 mb-1">Article Total</h2>
                        <div className="h2 text-primary mb-2">969.56 SAR</div>
                        <p className="fs-sm text-muted mb-0">To be paid on 8/15/2022</p>
                    </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-4">
                    <div className="h-100 bg-white rounded-3 shadow border-1 text-center p-4">
                        <h2 className="h6 pb-2 mb-1">Reviewer</h2>
                        <div className="h2 text-primary mb-2">{articleInfo?.reviewerList?.length}</div>
                        <ShowArticleReviewers articleId={articleInfo?._id} />
                    </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-4">
                    <div className="h-100 bg-white rounded-3 shadow border-1 text-center p-4">
                        <h2 className="h6 pb-2 mb-1">Editors</h2>
                        <div className="h2 text-primary mb-2">{articleInfo?.editors?.length}</div>
                        <ShowArticleEditors articleId={articleInfo?._id} />
                    </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-4">
                    <div className="h-100 bg-white rounded-3 shadow border-1 text-center p-4">
                        <h2 className="h6 pb-2 mb-1">Author</h2>
                        <div className="h2 text-primary mb-2">{articleInfo?.authorList ? articleInfo?.authorList?.length + 1 : '-'}</div>
                        <ShowArticleAuthors articleId={articleInfo?._id} />
                    </div>
                </div>
            </div>
            <section className="mt-2 mt-md-0 pb-5 mb-md-2 mb-lg-3 mb-xl-4 mb-xxl-5">
                <div className="row pb-md-4">
                    <div className="col-lg-8 pb-2 pb-md-0 mb-4 mb-md-0">
                        <div className="card shadow border-1 rounded-3 mb-3" >
                            <div className="card-body">
                                <h2 className="h6 text-center text-sm-start mb-4">
                                    Abstract
                                </h2>
                                <div
                                    style={{ textAlign: "justify", textJustify: "inter-word" }}
                                >
                                    {articleInfo?.abstract ? htmlContentParser(articleInfo?.abstract, 'abstract') : ''}
                                </div>
                                <div className="d-flex flex-wrap pt-3 pt-md-3 pt-xl-3 mt-xl-n2">
                                    <h2 className="h6 py-1 mb-0 me-4">Keywords:</h2>
                                    {
                                        articleInfo?.keywords?.map((keyword, index) => {
                                            return <a key={"keywords" + index} className="nav-link fs-sm py-1 px-0 me-3" href="#">
                                                <span className="text-primary">#</span>{keyword}
                                            </a>
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        <div>
                            <section className="border-1 card rounded-3 mb-3 p-3 p-sm-4">
                                <div className="d-flex align-items-center ml-4 pb-2 border-bottom">
                                    {/* Nav tabs */}
                                    <ul
                                        className="nav nav-tabs card-header-tabs align-items-center mb-n1"
                                        role="tablist"
                                    >
                                        {
                                            selectedArticleType?.elements?.map((item, index) => {
                                                return (
                                                    <Fragment key={`article_element_fragment_${item}`}>
                                                        {index != 0 ? <li className="vr opacity-20 my-3 me-3" /> : ``}
                                                        <li key={`article_element_type_action${index}`} className="nav-item me-3" role={`article${item}`}>
                                                            <a
                                                                className={`nav-link px-0 py-2 text-capitalize border-0 rounded-1 ${index == 0 ? 'active' : ''}`}
                                                                href={`#article${item}`}
                                                                data-bs-toggle="tab"
                                                                role="tab"
                                                                aria-controls={`article${item}`}
                                                                aria-selected="true"
                                                            >
                                                                {item.replace("_", " ")}
                                                            </a>
                                                        </li>
                                                    </Fragment>
                                                )
                                            })
                                        }
                                        <Fragment key={`article_element_type_reference`}>
                                            <li className="vr opacity-20 my-3 me-3" />
                                            <li key={`article_element_type_reference`} className="nav-item me-3" role={`articlereference`}>
                                                <a
                                                    className={`nav-link px-0 py-2 text-capitalize border-0 rounded-1`}
                                                    href={`#articlereference`}
                                                    data-bs-toggle="tab"
                                                    role="tab"
                                                    aria-controls={`articlereference`}
                                                    aria-selected="true"
                                                >
                                                    References
                                                </a>
                                            </li>
                                        </Fragment>
                                    </ul>
                                </div>
                                <div className="card mt-4">
                                    <div className="card-body">
                                        <div className="tab-content">
                                            {/* Tabs content */}
                                            <div className="tab-content">
                                                {
                                                    selectedArticleType?.elements?.map((item, index) => {
                                                        return (
                                                            <div key={`article_element_type_${index}`} className={`tab-pane fade show ${index == 0 ? 'active' : ''}`} id={`article${item}`} role="tabpanel">
                                                                <h2 className="h5 card-title text-capitalize">{item.replace("_", " ")}</h2>
                                                                <div style={{ textAlign: "justify", textJustify: "inter-word" }} >
                                                                    {htmlContentParser(articleInfo?.article_data_id[`${item}`], item)}
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                                {

                                                    <div key={`article_element_type_reference`} className={`tab-pane fade}`} id={`articlereference`} role="tabpanel">
                                                        <h2 className="h5 card-title text-capitalize">References</h2>
                                                        <div>
                                                            {
                                                                <span
                                                                    style={{
                                                                        textAlign: "justify",
                                                                        textJustify: "inter-word",
                                                                    }}
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: singleReferencesTextList,
                                                                    }}
                                                                />
                                                            }
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <section className="border-1 card h-100 rounded-3 mb-3 p-3 p-sm-4" id="type-inline">
                                <div className="d-flex align-items-center ml-4 pb-2 border-bottom">
                                    {/* Nav tabs */}
                                    <ul
                                        className="nav nav-tabs card-header-tabs align-items-center mb-n1"
                                        role="tablist"
                                    >
                                        <li className="nav-item me-3" role={`articleComment`}>
                                            <a
                                                className={`nav-link px-0 py-2 text-capitalize border-0 rounded-1 active`}
                                                href={`#articleComment`}
                                                data-bs-toggle="tab"
                                                role="tab"
                                                aria-controls={`articleComment`}
                                                aria-selected="true"
                                            >
                                                Comment
                                            </a>
                                        </li>
                                        <li className="vr opacity-20 my-3 me-3" />
                                        <li className="nav-item me-3" role={`articleAction`}>
                                            <a
                                                className={`nav-link px-0 py-2 text-capitalize border-0 rounded-1`}
                                                href={`#articleAction`}
                                                data-bs-toggle="tab"
                                                role="tab"
                                                aria-controls={`articleAction`}
                                                aria-selected="true"
                                            >
                                                Action History
                                            </a>
                                        </li>
                                        <li className="vr opacity-20 my-3 me-3" />
                                        <li className="nav-item me-3" role={`articleEditor`}>
                                            <a
                                                className={`nav-link px-0 py-2 text-capitalize border-0 rounded-1`}
                                                href={`#articleEditor`}
                                                data-bs-toggle="tab"
                                                role="tab"
                                                aria-controls={`articleEditor`}
                                                aria-selected="true"
                                            >
                                                User History
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="card mt-4">
                                    <div className="card-body">
                                        <div className="tab-content">
                                            {/* Tabs content */}
                                            <div className="tab-content">
                                                <div className={`tab-pane fade show active`} id={`articleComment`} role="tabpanel">
                                                    <h2 className="h5 card-title text-capitalize">Article Comment</h2>
                                                    {
                                                        comments?.map((commentItem, index) => {

                                                            let commentUserInfo = getArticleUserInfo(commentItem.addBy)

                                                            return (
                                                                <div key={`commentItem_${commentItem._id}`} className="border-bottom mt-2 mb-4">
                                                                    <div className="d-flex align-items-top pb-1 mb-1">
                                                                        <div className="rounded-circle bg-size-cover bg-position-center flex-shrink-0"
                                                                            style={{
                                                                                width: '48px',
                                                                                height: '48px',
                                                                                backgroundImage: `url(${(commentUserInfo?.file) ? `${import.meta.env.VITE_REACT_APP_URL}/public/uploads/profile/${commentUserInfo?.file}` : '/assets/img/avatar/user.png'})`
                                                                            }}
                                                                            alt="Comment author"
                                                                        />
                                                                        <div className="ps-3">
                                                                            <h6 className="mb-0">{commentUserInfo?.name ?? "System User"}</h6>
                                                                            <span className="fs-sm text-muted mb-1">{commentItem.commenterType}</span>
                                                                            <p className="pb-2 mb-0" style={{ textAlign: "justify", textJustify: "inter-word" }}>
                                                                                {commentItem.text}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    {
                                                                        commentItem?.replies?.map((reply, index) => {

                                                                            let replyUserInfo = getArticleUserInfo(reply.addBy)
                                                                            let replyUserTitle = getArticleUserTitle(reply.addBy);
                                                                            return (
                                                                                <div key={`commentItemReplies${reply._id}`} className="card card-body p-3 border-0 bg-secondary mb-3">
                                                                                    <div className="d-flex align-items-center">
                                                                                        <div className="rounded-circle bg-size-cover bg-position-center flex-shrink-0"
                                                                                            style={{
                                                                                                width: '48px',
                                                                                                height: '48px',
                                                                                                backgroundImage: `url(${(replyUserInfo?.file) ? `${import.meta.env.VITE_REACT_APP_URL}/public/uploads/profile/${replyUserInfo?.file}` : '/assets/img/avatar/user.png'})`
                                                                                            }}
                                                                                            alt="Comment author"
                                                                                        />
                                                                                        <div className="ps-3" >
                                                                                            <h6 className="mb-0">{replyUserInfo?.name ?? "System User"}</h6>
                                                                                            <span className="fs-sm text-muted">{replyUserTitle}</span>
                                                                                            {

                                                                                                reply.type === "image" ? (
                                                                                                    <>
                                                                                                        <div className="d-flex align-items-end justify-content-start mb-1">
                                                                                                            <img
                                                                                                                className="border border-1 rounded-2 m-2 p-2 center-block"
                                                                                                                style={{ width: "60%" }}
                                                                                                                src={`${import.meta.env
                                                                                                                    .VITE_REACT_APP_URL
                                                                                                                    }/public/uploads/${reply?.file}`}
                                                                                                            />
                                                                                                        </div>
                                                                                                        <div className="fs-xs text-muted">
                                                                                                            {reply?.text}
                                                                                                        </div>
                                                                                                    </>
                                                                                                ) : reply.type === "file" ? (
                                                                                                    <div className="message-box-start text-dark">
                                                                                                        <a
                                                                                                            className="d-flex align-items-top text-decoration-none pb-2"
                                                                                                            href="#"
                                                                                                        >
                                                                                                            <i className="ai-file text-black display-6 mt-1 pe-1 me-2"></i>
                                                                                                            <div className="order-sm-1 pe-sm-3 me-xl-4">
                                                                                                                <p className="mb-1 st text-black">
                                                                                                                    <strong>
                                                                                                                        {reply.text}
                                                                                                                    </strong>
                                                                                                                </p>
                                                                                                                <div className="fs-xs text-muted">
                                                                                                                    File: {reply?.file}
                                                                                                                </div>
                                                                                                                <a
                                                                                                                    className="btn btn-link p-0"
                                                                                                                    href={`${import.meta.env.VITE_REACT_APP_URL}/public/uploads/${reply?.file}`}
                                                                                                                    target="_blank"
                                                                                                                    rel="Click to Download file"
                                                                                                                >
                                                                                                                    Download{" "}
                                                                                                                    <i className="ai-download ms-2"></i>
                                                                                                                </a>
                                                                                                            </div>
                                                                                                        </a>
                                                                                                    </div>
                                                                                                ) : (

                                                                                                    <div className="text-dark">
                                                                                                        {reply.text}
                                                                                                    </div>
                                                                                                )
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })
                                                                    }
                                                                </div>
                                                            );
                                                        })
                                                    }
                                                </div>
                                                <div className={`tab-pane fade show`} id={`articleAction`} role="tabpanel">
                                                    <h2 className="h5 card-title text-capitalize">Article Activities</h2>
                                                    {
                                                        articleHistory?.change_status_history_list?.map((editItem, index) => {

                                                            let userInfo = getArticleUserInfo(editItem.changedBy);

                                                            return (
                                                                <div key={`articleHistoryEdit_${editItem._id}`} className="border-bottom mt-2 mb-4">
                                                                    <div className="d-flex align-items-top pb-1 mb-1">
                                                                        <div className="rounded-circle bg-size-cover bg-position-center flex-shrink-0"
                                                                            style={{
                                                                                width: '48px',
                                                                                height: '48px',
                                                                                backgroundImage: `url(${(userInfo?.file) ? `${import.meta.env.VITE_REACT_APP_URL}/public/uploads/profile/${userInfo?.file}` : '/assets/img/avatar/user.png'})`
                                                                            }}
                                                                            alt={`${userInfo?.name} Profile`}
                                                                        />
                                                                        <div className="ps-3">
                                                                            <h6 className="mb-0">{userInfo?.name ?? "System User"}</h6>
                                                                            <span className="fs-sm text-muted mb-1">{moment(editItem.date)?.format("LLL")}</span>
                                                                            <p className="pb-2 mb-0" style={{ textAlign: "justify", textJustify: "inter-word" }}>
                                                                                {editItem.title}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })
                                                    }
                                                </div>
                                                <div className={`tab-pane fade show`} id={`articleEditor`} role="tabpanel">
                                                    <h2 className="h5 card-title text-capitalize">Article Editor</h2>
                                                    {
                                                        articleHistory?.change_editor_history_list?.map((editorItem, index) => {

                                                            let editorInfo = getArticleUserInfo(editorItem.editor);

                                                            return (
                                                                <div key={`articleHistoryEditor${editorItem._id}`} className="border-bottom mt-2 mb-4">
                                                                    <div className="d-flex align-items-top pb-1 mb-1">
                                                                        <div className="rounded-circle bg-size-cover bg-position-center flex-shrink-0"
                                                                            style={{
                                                                                width: '48px',
                                                                                height: '48px',
                                                                                backgroundImage: `url(${(editorInfo?.file) ? `${import.meta.env.VITE_REACT_APP_URL}/public/uploads/profile/${editorInfo?.file}` : '/assets/img/avatar/user.png'})`
                                                                            }}
                                                                            alt={`${editorInfo?.name} Editor Profile`}
                                                                        />
                                                                        <div className="ps-3">
                                                                            <h6 className="mb-0">{editorInfo?.name ?? "System User"}</h6>
                                                                            <span className="fs-sm text-muted mb-1">{moment(editorItem.date)?.format("LLL")}</span>
                                                                            <p className="pb-2 mb-0" style={{ textAlign: "justify", textJustify: "inter-word" }}>
                                                                                {editorItem.title}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                    {/* Relevant articles sidebar*/}
                    <aside className="col-lg-4 mb-2"
                        style={{ marginTop: "-115px" }}
                    >
                        <div
                            className="position-sticky top-0 ps-xl-0"
                            style={{ paddingTop: 125 }}
                        >
                            <div className="card shadow border-1 rounded-3 mb-3">
                                <div className="card-body">
                                    <h2 className="h6 py-1 mb-0 me-4">Article Number:</h2>
                                    <p>{articleInfo?.articleNumber}</p>
                                    <h2 className="h6 py-1 mb-0 me-4">Volume:</h2>
                                    <p>{articleInfo?.articleMetaInfo?.name}</p>
                                    <h2 className="h6 py-1 mb-0 me-4">Submitted At:</h2>
                                    <p>{articleInfo?.submittedAt ? moment(articleInfo?.submittedAt)?.format("LLL") : "Waiting for Submission"}</p>
                                    <h2 className="h6 py-1 mb-0 me-4">Accepted At:</h2>
                                    <p>{articleInfo?.acceptedAt ? moment(articleInfo?.acceptedAt)?.format("LLL") : "Waiting for Acceptance"}</p>
                                </div>
                            </div>
                            <div className='card rounded-3 mb-3'>
                                <div className='card-body m-0 p-4'>
                                    <h3 className="h5 mb-3 pb-3 border-bottom">Authors</h3>
                                    {
                                        authorList?.map((data, index) => {
                                            return <div key={`authorList_${index}`} className="card mt-2 rounded-3">
                                                <div className="card-body p-2">
                                                    <div className="d-md-flex align-items-center">
                                                        <div className="d-sm-flex align-items-center m-2">
                                                            <div className="rounded-circle bg-size-cover bg-position-center flex-shrink-0 ml-4"
                                                                style={{
                                                                    width: '48px',
                                                                    height: '48px',
                                                                    backgroundImage: `url(${data?.file ? `${import.meta.env.VITE_REACT_APP_URL}/public/uploads/profile/${data?.file}` : '/assets/img/avatar/user.png'})`
                                                                }}
                                                                alt={`${data.name} author profile`} />
                                                            <div className="pt-3 pt-sm-0 ps-sm-3">
                                                                <h4 className="h6 mb-0">
                                                                    {data.name}{data.isMainAuthor ? <i className="ai-circle-check-filled fs-base text-success ms-2"></i> : ``}
                                                                </h4>
                                                                <div className="text-muted fw-medium d-flex align-items-center">
                                                                    <div className="d-flex align-items-center me-3 text-wrap">
                                                                        <i className="ai-mail me-1" />{data.email}
                                                                    </div>
                                                                </div>
                                                                <div className="text-muted fw-medium d-flex align-items-center">
                                                                    <div className="d-flex align-items-center me-3 text-wrap">
                                                                        <i className="ai-star me-1" />{data.occupation}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        })
                                    }
                                </div>

                            </div>
                        </div>
                    </aside>
                </div>
            </section>

            <ActionHistoryModel />
            <PublishArticleModel />
            <ArticleEditorsModel articleId={articleInfo?._id} />
            <ArticleReviewerModel articleId={articleInfo?._id} />
            <ArticleAuthorModel />

            <ArticleCitationModel articleId={articleInfo?._id} />
        </>
    );
};

export default ArticleInformation;