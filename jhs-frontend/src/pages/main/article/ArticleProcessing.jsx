/* eslint-disable */
import React, { useEffect, useRef, useState } from "react";

import { Link, useParams } from "react-router-dom";
import parse from "html-react-parser";
import { useDispatch, useSelector } from "react-redux";

import { send, OpenSocket } from '../../../config/websocket';

import {
    deleteMyArticle,
    getArticle,
    getArticleActionHistory,
    getArticleEditor,
    getArticleAuthors,
    getArticleCommentReplies,
    getArticleReviewers,
    getArticleReferencesTextList,
} from "../../../store/main/articles/actions";
import ArticleActions from "./operations/ArticleActions";
import ShowActionHistory from "./operations/ShowActionHistory";
import ArticleStatusName from "./operations/ArticleStatus";
import ActionHistoryModel from "./operations/ActionHistoryModel";
import { getAllArticleType } from "store/admin/articleType/actions";
import { getArticleUserInfo, toggleModal } from "helpers/globalHelpers";
import ExportCitation from "./operations/ExportCitation";
import ArticleCitationModel from "./operations/ArticleCitationModel";
import AddCommentModel from "./operations/AddCommentModel";
import ArticleCommentActions from "./processing/ArticleCommentActions";
import ArticleTableView from "./preview/ArticleTableView";
import ArticleFigureView from "./preview/ArticleFigureView";
import SelectTextPopover from "./operations/SelectTextPopover";
import ArticleCommentReplyModel from "./processing/ArticleCommentReplyModel";
import ArticleDiscussionTab from "./processing/ArticleDiscussionTab";
import PublishArticleModel from "./operations/PublishArticleModel";

const ArticleProcessing = () => {
    const dispatch = useDispatch();
    let { articleId } = useParams();
    const [selectedCategory, setSelectedCategory] = useState({});
    const articleInfo = useSelector((state) => state.article.single);
    const singleReferencesTextList = useSelector((state) => state.article.singleReferenceTextList);
    const articleTypes = useSelector((state) => state.articleType.list);
    const selectedArticleType = useSelector((state) => state.articleType.selected);
    const comments = useSelector((state) => state.article.comments);

    useEffect(() => {
        comments.forEach((comment) => {
            let commentUserInfo = getArticleUserInfo(comment.addBy);
            
            highlight(comment.highlight, comment._id, comment.text, comment.startOffset, comment.endOffset, comment.forArea, commentUserInfo);
        });
    }, [comments]);
    useEffect(() => {
        dispatch(getArticle({ body: {}, options: { id: articleId, btnLoader: true, __module: "article" } }));
        dispatch(getArticleReferencesTextList({ body: {}, options: { id: articleId, btnLoader: true, __module: 'article', } }));
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



    // socket
    // getting state of Socket conn
    const socketConn = useSelector((state) => state.articleProcessingSocket.conn);
    const socketSession = useSelector((state) => state.articleProcessingSocket);
    const [selectedText, setSelectedText] = useState('');
    let token = localStorage.getItem('accessToken');

    // if connection not open then Initiate Socket ArticleProcessing Connection
    useEffect(() => {
        if (!socketConn) new OpenSocket({ token, url: 'articleProcessing' });
    }, [socketConn?.readyState]);

    useEffect(() => {
        let interval = null;
        if (socketSession.status) {
            // sending message with event name, same as redux comment reducer name. SET_MY_ARTICLE_COMMENTS
            dispatch(
                send(socketSession, 'SET_MY_ARTICLE_COMMENTS', { articleId })
            );
            interval = setInterval(() => {
                dispatch(
                    send(socketSession, 'SET_MY_ARTICLE_COMMENTS', { articleId })
                );
            }, 2000);
        }
        return () => {
            clearInterval(interval);
        };
    }, [socketSession.status]);

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

    function highlight(text, highlightId, comment, startOffset, endOffset, forArea, commentUserInfo) {
        var alreadyHighlight = document.getElementById(highlightId);
        if (alreadyHighlight == null) {
            var element = document.getElementById(forArea);
             // var innerHTML = inputText.innerHTML;
            // var index = innerHTML.indexOf(text);
            // let firstPart = innerHTML.substring(0, startOffset);
            // let secondPart = innerHTML.substring(endOffset, innerHTML.length);
            // console.log(firstPart);
            // console.log( secondPart);
            // if (index >= 0) {
            //     innerHTML = firstPart + `<span id='${highlightId}' class='highlight'>` + innerHTML.substring(index, index + text.length) + "</span>" + secondPart;
            //     inputText.innerHTML = innerHTML;
            // }
            if (element) {
                let textNode = element.firstChild.firstChild; // Assuming the content is plain text
                if(forArea ==="data_abstract"){
                    textNode = element.firstChild
                }
                var innerHTML = textNode.innerHTML;
                var index = innerHTML.indexOf(text);
                let firstPart = innerHTML.substring(0, startOffset);
                let secondPart = innerHTML.substring(startOffset, endOffset);
                let thirdPart = innerHTML.substring(endOffset, innerHTML.length);
                if (index >= 0) {
                    innerHTML = firstPart + `<span 
                                                title="Author: ${commentUserInfo?.name} | Comment: ${comment}" id='${highlightId}' 
                                                data-addBy='${commentUserInfo?._id}' 
                                                data-text='${comment}' 
                                                class='highlight-article' 
                                                style='background-color: ${getHighlightColorById(commentUserInfo._id).background}; border: 2px solid; padding: 0 2px; border-color: ${getHighlightColorById(commentUserInfo._id).borderColor};'>
                                                    ${secondPart}
                                                    <div class="hightlight-popover">
                                                        <div>
                                                            <img style="width: 40px; height: 40px;" src="/assets/img/avatar/user.png" alt="${commentUserInfo?.name}" />
                                                        </div>
                                                        <div style="padding-left: 10px">
                                                            <strong>${commentUserInfo?.name}</strong><br>
                                                            <span class="text-span">${comment}</span>                                                        
                                                        </div>
                                                    </div>
                                                </span>` 
                    innerHTML += thirdPart;
                    textNode.innerHTML = innerHTML;
                }
            }
        }
    }

    const articleCommentRepliesHandler = (commentId) => {
        dispatch(
            getArticleCommentReplies({
                body: { commentId: commentId },
                options: { id: articleId, btnLoader: true, __module: 'article', showToast: false },
            }));
        toggleModal('#showArticleCommentReplyModel')
    }

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
                <div className="row pb-md-4"
                    style={{
                        zIndex: 900,
                    }}
                >
                    {/* Relevant article sidebar */}
                    <aside className="col-lg-2 mb-4"
                        style={{ marginTop: "-115px" }}
                    >
                        <div
                            className="position-sticky mx-4 px-4 top-0"
                            style={{ paddingTop: 125 }}
                        >
                            <div className="position-lg-sticky top-0">
                                <div className="offcanvas-lg offcanvas-start" id="sidebarAccount">
                                    <button className="btn-close position-absolute top-0 end-0 mt-3 me-3 d-lg-none" type="button" data-bs-dismiss="offcanvas" data-bs-target="#sidebarAccount" />
                                    <div className="offcanvas-body ml-4">
                                        <div className="pb-2 pb-lg-0">
                                            <h4 className="h4 text-break">{articleInfo?.type}</h4>
                                        </div>
                                        <li className="nav flex-column pb-1 mb-1">
                                            <span className="nav-link px-0 py-1"><i className="ai-grid fs-lg opacity-90 me-2"></i>Title Page</span>
                                            <ul className="nav flex-column border-start ps-3 ms-2 mb-2">
                                                <li className="nav-item"><a className={`nav-link fs-sm fw-normal py-0 ps-1 pe-0 mb-1 ${location.pathname === `/main/article/${articleId}/process#title` ? 'active' : ''} `} href={"#title"} data-scroll="data-scroll">Title</a></li>
                                                <li className="nav-item"><a className={`nav-link fs-sm fw-normal py-0 ps-1 pe-0 mb-1 ${location.pathname === `/main/article/${articleId}/process#abstract` ? 'active' : ''}`} href={"#abstract"} data-scroll="data-scroll">Abstract</a></li>
                                                <li className="nav-item"><a className={`nav-link fs-sm fw-normal py-0 ps-1 pe-0 mb-1 ${location.pathname === `/main/article/${articleId}/process#keyword` ? 'active' : ''} `} href={"#keyword"} data-scroll="data-scroll">Keywords</a></li>
                                            </ul>
                                        </li>
                                        <li className="nav flex-column pb-1 mb-1">
                                            <span className="nav-link px-0 py-1"><i className="ai-user fs-lg opacity-90 me-2"></i>Author</span>
                                            <ul className="nav flex-column border-start ps-3 ms-2 mb-2">
                                                <li className="nav-item"><a className={`nav-link fs-sm fw-normal py-0 ps-1 pe-0 mb-1 ${location.pathname === `/main/article/${articleId}/process#author` ? 'active' : ''} `} href={"#author"} data-scroll="data-scroll">Author</a></li>
                                            </ul>
                                        </li>
                                        <li className="nav flex-column pb-1 mb-1">
                                            <span className="nav-link px-0 py-1"><i className="ai-file-text fs-lg opacity-90 me-2"></i>Article</span>
                                            <ul className="nav flex-column border-start ps-3 ms-2 mb-2">
                                                {selectedArticleType?.elements?.map((item, index) => {
                                                    return (
                                                        <li className="nav-item" key={"pageLink" + item}><a className={`nav-link text-capitalize fs-sm fw-normal py-0 ps-1 pe-0 mb-1 ${location.pathname === `/main/article/${articleId}/process#${item}` ? 'active' : ''}`} href={`#${item}`} data-scroll="data-scroll">{item.replace("_", " ")}</a></li>
                                                    )
                                                })}
                                            </ul>
                                        </li>
                                        <li className="nav flex-column pb-1 mb-1">
                                            <a className={`nav-link px-0 py-1 ${location.pathname === `/main/article/${articleId}/process#reference` ? 'active' : ''}`} href={"#reference"}><i className="ai-list fs-lg opacity-90 me-2"></i>References</a>
                                        </li>
                                        <li className="nav flex-column pb-1 mb-1">
                                            <span className="nav-link px-0 py-1"><i className="ai-table fs-lg opacity-90 me-2"></i>Table</span>
                                        </li>
                                        <li className="nav flex-column pb-1 mb-1">
                                            <span className="nav-link px-0 py-1"><i className="ai-image fs-lg opacity-90 me-2"></i>Figures</span>
                                        </li>
                                        <li className="nav flex-column pb-1 mb-1">
                                            <a className={`nav-link px-0 py-1 ${location.pathname === `/main/article/${articleId}/process#reviewers` ? 'active' : ''}`} href={"#reviewers"}><i className="ai-user-group fs-lg opacity-90 me-2"></i>Reviewers</a>
                                        </li>
                                        <li className="nav flex-column pb-1 mb-1">
                                            <a className={`nav-link px-0 py-1 ${location.pathname === `/main/article/${articleId}/process#summary` ? 'active' : ''}`} href={"#summary"}><i className="ai-align-justify fs-lg opacity-90 me-2"></i>Summary</a>
                                        </li>
                                        <li className="nav flex-column pb-1 mb-1">
                                            <a className={`nav-link px-0 py-1 ${location.pathname === `/main/article/${articleId}/process#submit` ? 'active' : ''}`} href={"#submit"}><i className="ai-checks fs-lg opacity-90 me-2"></i>Submit</a>
                                        </li>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                    {/* Relevant article data */}
                    <div className="col-lg-7 pb-2 pb-md-0 mb-4 mb-md-0">
                        <SelectTextPopover id={`articleData`} setSelectedCategory={setSelectedCategory} setSelectedText={setSelectedText}>
                            <div className="card shadow border-0 rounded-3 mb-3">
                                <div className="card-body">
                                    <h2 id="abstract" key="abstract" className="h5 text-center text-sm-start mb-4 text-capitalize">
                                        Abstract
                                    </h2>
                                    {
                                        <span
                                            id={`data_abstract`}
                                            style={{ textAlign: "justify", textJustify: "inter-word" }}
                                            dangerouslySetInnerHTML={{ __html: articleInfo?.abstract }}
                                        />
                                    }

                                    <div className="d-flex flex-wrap pt-3 pt-md-3 pt-xl-3 mt-xl-n2 mb-4 ">
                                        <h2 id="keyword" key="keyword" className="h5 py-1 mb-0 me-4 text-capitalize">
                                            Keywords:
                                        </h2>
                                        {articleInfo?.keywords?.map((keyword, index) => {
                                            return (
                                                <a key={`articleInfoKeyword_${index}`} className="nav-link fs-sm py-1 px-0 me-3" href="#">
                                                    <span className="text-primary">#</span>
                                                    {keyword}
                                                </a>
                                            );
                                        })}
                                    </div>

                                    {selectedArticleType?.elements?.map((item, index) => {
                                        return (
                                            <div
                                                className={`tab-pane fade show ${index == 0 ? "active" : ""}`}
                                                id={item.replace("_", " ")}
                                                key={`selectedArticleTypeElements${index}`}
                                                role="tabpanel"
                                            >
                                                <h2 id={`${item}`} key={`${item}`} className="h5 text-center text-sm-start mb-2 text-capitalize">
                                                    {item.replace("_", " ")}
                                                </h2>
                                                <div
                                                    className="mb-4"
                                                    style={{
                                                        textAlign: "justify",
                                                        textJustify: "inter-word",
                                                    }}
                                                    id={`data_${item}`}
                                                >
                                                    {htmlContentParser(articleInfo?.article_data_id[`${item}`], item)}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    <h2 id="references" key={'references'} className="h5 text-center text-sm-start mb-2 text-capitalize">References</h2>
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
                            </div>
                        </SelectTextPopover>
                    </div>
                    {/* Relevant article sidebar */}
                    <aside className="col-lg-3 mb-2"
                        style={{ marginTop: "-115px" }}
                    >
                        <div
                            className="position-sticky top-0 ps-xl-0"
                            style={{ paddingTop: 125 }}
                        >
                            <h2 className="h4">Relevant Discussion</h2>
                            <div className="card border-0 bg-transparent">
                                <div className="card-body d-flex justify-content-center align-items-center border-dashed border-2 rounded-3 py-4 mb-3">
                                    <a className="h5 text-nav text-center text-transparent mb-0" onClick={() => { toggleModal('#addCommentModel') }}>Add New Comment </a>
                                </div>
                            </div>
                            <div
                                className="card-body border-dashed border-2 rounded-3 p-2"
                                style={{
                                    overflowY: 'scroll',
                                    height: '70vh',
                                    maxHeight: '70vh',
                                }}>
                                {/* Default accordion */}
                                <div className="accordion" id="accordionDefault">
                                    {
                                        comments?.map((commentItem, index) => {

                                            let commentUserInfo = getArticleUserInfo(commentItem.addBy);

                                            return (
                                                <div className="accordion-item shadow border-1 bg-white" key={"commentItemInfoKey" + index}>
                                                    <h3 className="accordion-header" id={"commentItemInfo" + index}>
                                                        <button
                                                            className="accordion-button"
                                                            type="button"
                                                            data-bs-toggle="collapse"
                                                            data-bs-target={"#collapseCommentItemInfo" + index}
                                                            aria-expanded="true"
                                                            aria-controls={"collapseCommentItemInfo" + index}
                                                        >
                                                            <div className="d-flex align-items-top pb-0 mb-0">
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
                                                                    <span className="fs-sm text-muted mb-0">{commentItem.commenterType}</span>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    </h3>
                                                    <div
                                                        className="accordion-collapse collapse"
                                                        id={"collapseCommentItemInfo" + index}
                                                        aria-labelledby={"commentItemInfo" + index}
                                                        data-bs-parent="#accordionDefault"
                                                    >
                                                        <div className="accordion-body fs-sm">
                                                            <div className="row mt-sm-n1 mb-0">
                                                                <div className="col-11">
                                                                    <p className="pb-2 mb-0 text-break lh-base" style={{ textJustify: "inter-word" }}>
                                                                        {commentItem.text}
                                                                    </p>
                                                                </div>
                                                                <div className="col-1">
                                                                    <div className="d-flex flex-row-reverse mt-sm-n1 pt-2 mb-0 mb-lg-1 mb-xl-3">
                                                                        <a data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                            <i className="fas fa-ellipsis-v" />
                                                                        </a>
                                                                        <div className="dropdown dropdown-menu dropdown-menu-end my-1">
                                                                            <button className="dropdown-item" onClick={() => { highlight(commentItem.highlight, commentItem._id, commentItem.text, commentItem.startOffset, commentItem.endOffset, commentItem.forArea, commentUserInfo) }}><i className="ai-edit-alt me-2"></i> Highlight Text</button>
                                                                            <button className="dropdown-item" onClick={() => { articleCommentRepliesHandler(commentItem._id) }}><i className="ai-dashboard me-2"></i>  Show Comment Discussion</button>
                                                                            <ArticleCommentActions socket={socketSession} articleId={articleInfo?._id} article={articleInfo} comment={commentItem} ActionType="dropdown-item" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
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

            <AddCommentModel articleId={articleInfo?._id} selectedCategory={selectedCategory} selectedText={selectedText} />

            <ArticleCitationModel articleId={articleInfo?._id} />
            <ArticleCommentReplyModel articleId={articleId} />

            <ArticleCitationModel articleId={articleInfo?._id} />
        </div>
    );
};

export default ArticleProcessing;
