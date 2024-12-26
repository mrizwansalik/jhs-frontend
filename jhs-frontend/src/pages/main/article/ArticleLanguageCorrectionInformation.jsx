/* eslint-disable */
import React, { Fragment, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import parse from "html-react-parser";
import { useDispatch, useSelector } from 'react-redux';
import { deleteMyArticle, getArticle } from '../../../store/main/articles/actions';
import ArticleStatusName from './operations/ArticleStatus';
import { getAllArticleType } from 'store/admin/articleType/actions';
import moment from 'moment';
import { calculateChanges } from 'helpers/globalHelpers';
import ArticleFigureView from './preview/ArticleFigureView';
import ArticleTableView from "./preview/ArticleTableView";
import { getArticleLanguageCorrection, getArticleLanguageCorrectionReferencesTextList } from 'store/main/articlesLanguageCorrection/actions';
import ArticleActions from './operations/ArticleActions';

const ArticleLanguageCorrectionInformation = () => {
    const dispatch = useDispatch();
    let { articleId } = useParams();
    const articleInfo = useSelector((state) => state.article.single);
    const articleLanguageCorrectionInfo = useSelector((state) => state.articleLanguageCorrection.single);
    const singleOldReferenceTextList = useSelector((state) => state.articleLanguageCorrection.singleOldReferenceTextList);
    const singleNewReferenceTextList = useSelector((state) => state.articleLanguageCorrection.singleNewReferenceTextList);
    const articleTypes = useSelector((state) => state.articleType.list);
    const selectedArticleType = useSelector((state) => state.articleType.selected);

    useEffect(() => {
        dispatch(getArticle({ body: {}, options: { id: articleId, btnLoader: true, __module: 'article', } })); 
        dispatch(getArticleLanguageCorrection({ body: {}, options: { id: articleId, btnLoader: true, __module: 'articleLanguageCorrection', } })); 
        dispatch(getArticleLanguageCorrectionReferencesTextList({ body: {}, options: { id: articleId, btnLoader: true, __module: 'articleLanguageCorrection', } })); 
        
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
        
        let languageCorrectionTableCount = calcPreviousTableCount(item);
        let languageCorrectionFigureCount = calcPreviousFigureCount(item);

        const parsedHtml = parse(data, {
            replace: (node, index) => {
                if (
                    node.type === "tag" &&
                    node.name === "section" &&
                    node.attribs["data-id"] &&
                    node.attribs["widget-type"] === "table"
                ) {
                    const dataId = node.attribs["data-id"];
                    if(node.attribs["type"] !== "languageCorrection"){
                        let tableData = articleInfo.article_data_id.table_list.find(({ _id }) => _id === dataId);
                        if (tableData) {
                            tableCount++
                            return <ArticleTableView tableData={tableData} tableNo={tableCount} />
                        }
                    } else {
                        tableData = articleLanguageCorrectionInfo.articleLanguageCorrection_data_id.table_list.find(({ _id }) => _id === dataId);
                        if (tableData) {
                            languageCorrectionTableCount++
                            return <ArticleTableView tableData={tableData} tableNo={languageCorrectionTableCount} />
                        }
                    }
                }

                if (
                    node.type === "tag" &&
                    node.name === "section" &&
                    node.attribs["data-id"] &&
                    node.attribs["widget-type"] === "figure"
                ) {
                    const dataId = node.attribs["data-id"];
                    let figureData = articleInfo.article_data_id.figures_list.find(({ _id }) => _id === dataId);
                    if (figureData) {
                        figureCount++
                        return <ArticleFigureView figureData={figureData} figureNo={figureCount} />
                    }
                    figureData = articleLanguageCorrectionInfo.articleLanguageCorrection_data_id.figures_list.find(({ _id }) => _id === dataId);
                    if (figureData) {
                        languageCorrectionFigureCount++
                        return <ArticleFigureView figureData={figureData} figureNo={languageCorrectionFigureCount} />
                    }
                }
                return undefined
            }
        });
        return <div>{parsedHtml}</div>
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
                            </div>
                        </div>
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
                                    {articleInfo?.abstract ? htmlContentParser(calculateChanges(articleInfo?.abstract, articleLanguageCorrectionInfo?.abstract ?? ''), 'abstract') : ''}
                                </div>
                                <div className="d-flex flex-wrap pt-3 pt-md-3 pt-xl-3 mt-xl-n2">
                                    <h2 className="h6 py-1 mb-0 me-4">Keywords:</h2>
                                    {
                                        articleInfo?.keywords?.map((keyword, index) => {
                                            return <a key={"keywords" + index} className="nav-link fs-sm py-1 px-0 me-3" href="#">
                                                <span className="text-primary">#</span>{htmlContentParser(calculateChanges(keyword, articleLanguageCorrectionInfo?.keywords[index] ?? ''))}
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
                                                                <h2 className="h2 card-title text-capitalize">{item.replace("_", " ")}</h2>
                                                                <div style={{ textAlign: "justify", textJustify: "inter-word" }} >
                                                                    {htmlContentParser(calculateChanges(articleInfo?.article_data_id[`${item}`] ?? '', articleLanguageCorrectionInfo?.articleLanguageCorrection_data_id[`${item}`] ?? ''), item)}
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
                                                                htmlContentParser(calculateChanges(singleOldReferenceTextList ?? '', singleNewReferenceTextList ?? ''), 'reference')
                                                            }
                                                        </div>
                                                    </div>
                                                }
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
                            <div className="card shadow border-1 rounded-3 mb-3">
                                <div className="card-body">
                                    <ArticleActions taskState={articleInfo?.articleStatus?.slug} articleId={articleInfo?._id} article={articleInfo} ActionType={`btn btn-primary w-100 mb-2`} />
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </>
    );
};

export default ArticleLanguageCorrectionInformation;