/* eslint-disable */
import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { getDraftArticle, getDraftArticleReferencesTextList } from 'store/main/articles/actions';
import { getAllArticleType } from 'store/admin/articleType/actions';
import parse from "html-react-parser";
import ArticleTableView from './ArticleTableView';
import ArticleFigureView from './ArticleFigureView';
import style from '../../ArticleStyle/custom-article-style.module.css'

const ArticleDraft = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    let { articleId } = useParams();

    const articleInfo = useSelector((state) => state.article.singleDraft);
    const singleReferencesTextList = useSelector((state) => state.article.singleDraftReferenceTextList);
    const articleTypes = useSelector((state) => state.articleType.list);
    const selectedArticleType = useSelector((state) => state.articleType.selected);
    let articleAbstract = articleInfo?.abstract;

    useEffect(() => {
        dispatch(getDraftArticle({ body: {}, options: { id: articleId, btnLoader: true, __module: 'article', } }));
        dispatch(getDraftArticleReferencesTextList({ body: {}, options: { id: articleId, btnLoader: true, __module: "article" }, }));
        dispatch(getAllArticleType({ body: {}, options: { __module: 'articleType', } }));
    }, [dispatch, articleId]);

    useEffect(() => {
        if (articleTypes?.length && articleInfo !== null) {
            let selectedArticle = articleTypes?.filter((article) => article.name === articleInfo.type);
            dispatch({ type: 'SELECTED_ARTICLE', payload: selectedArticle[0] });
        }
    }, [articleInfo, articleTypes]);

    const handleArticleData = (data) => {
        articleAbstract = data;
    }

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

    return (
        <div className="mx-4 px-4">
            <div className="card border-0 border-start border-4 border-primary rounded-4 mb-3">
                <div className="card-body">
                    <div className='row mt-sm-n1 mb-0'>
                        <div className='col-10'>
                            <h1 className="h2 fw-normal lh-base">
                                <span className="text-primary fw-semibold">{articleInfo?.title}</span>
                            </h1>
                        </div>
                        <div className='col-2'>
                            <div className="d-flex flex-row-reverse mt-sm-n1 mb-0 mb-lg-1 mb-xl-3">
                                <Link
                                    data-bs-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                >
                                    <i className="fas fa-ellipsis-v text-primary"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                    {articleInfo?.category?.map((category) => {
                        return (
                            <span key={category?._id} className="badge border border-primary text-primary border-1 fs-sm m-2">
                                <i className='ai-tag fs-lg opacity-90 me-2'> </i>{category?.name}
                            </span>
                        );
                    })}
                </div>
            </div>

            <section className="mt-2 mt-md-0 pb-5 mb-md-2 mb-lg-3 mb-xl-4 mb-xxl-5">
                <div className="row pb-md-4">
                    {/* Relevant articles sidebar*/}
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
                    <div className="col-lg-10 pb-2 pb-md-0 mb-4 mb-md-0">
                        <div className="card shadow border-0 rounded-3 mb-3">
                            <div className="card-body">
                                <h2 id="abstract" key="abstract" className="h6 text-center text-sm-start mb-2 text-capitalize">
                                    Abstract
                                </h2>
                                {
                                    <div
                                        style={{ textAlign: "justify", textJustify: "inter-word" }}
                                        dangerouslySetInnerHTML={{ __html: articleInfo?.abstract }}
                                    />
                                }

                                <div className="d-flex flex-wrap pt-3 pt-md-3 pt-xl-3 mt-xl-n2 mb-2 ">
                                    <h2 id="keyword" key="keyword" className="h6 py-1 mb-0 me-4 text-capitalize">
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
                                            id={`selectedArticleTypeElements${index}`}
                                            key={`selectedArticleTypeElements${index}`}
                                            role="tabpanel"
                                        >
                                            <h2 id={`${item}`} key={`${item}`} className="h6 text-center text-sm-start mb-2 text-capitalize">
                                                {item.replace("_", " ")}
                                            </h2>
                                            <div
                                                style={{
                                                    textAlign: "justify",
                                                    textJustify: "inter-word",
                                                }}
                                            >
                                                {htmlContentParser(articleInfo?.article_data_id[`${item}`], item)}
                                            </div>
                                        </div>
                                    );
                                })}

                                <div className="d-flex flex-wrap pt-3 pt-md-3 pt-xl-3 mt-xl-n2 mb-4 ">
                                    <h2  id={`reference`}
                                        key={`reference`}
                                        className="h6 py-1 mb-0 me-4 text-capitalize">
                                        References:
                                    </h2>
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

                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ArticleDraft;
