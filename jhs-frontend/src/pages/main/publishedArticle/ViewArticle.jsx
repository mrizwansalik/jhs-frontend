/* eslint-disable */
import React, { useState } from "react";

import { Link, useParams } from "react-router-dom";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

import ArticleTableView from "./preview/PublishedArticleTableView";
import ArticleFigureView from "./preview/PublishedArticleFigureView";

const ViewArticle = () => {
    let { articleId } = useParams();

    const articleInfo = useSelector((state) => state.home.single);
    const selectedArticleType = useSelector((state) => state.home.selectedArticleType);
    const singleReferencesTextList = useSelector((state) => state.home.singleReferencesTextList);

    const scrollToSection = (goto) => {
        const offset = 137; // Set your desired padding here
        let targetPosition;

        // Determine the target position based on the section to scroll to
        const targetElement = document.getElementById(goto);
        if (targetElement) {
            targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - offset;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth', // Optional smooth scroll
            });
        }
    };

    const calcPreviousTableCount = (currentArticleType) => {
        let arr = [];
        let pageIndex = selectedArticleType?.elements.indexOf(currentArticleType); // 1
        for (let i = pageIndex - 1; i >= 0; i--) {
            let data =
                articleInfo?.articlePublished_data_id?.[
                selectedArticleType?.elements[i]
                ];
            if (data) {
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = data;
                const dataIdArray = [];
                // const elementsWithDataId = tempDiv.querySelectorAll('[data-id]');
                const elementsWithDataId = tempDiv.querySelectorAll(
                    "[data-id][widget-type=table]"
                );
                elementsWithDataId.forEach((element) => {
                    dataIdArray.push(element.getAttribute("data-id"));
                });
                arr = [...arr, ...dataIdArray];
            }
        }
        return arr.length;
    };
    const calcPreviousFigureCount = (currentArticleType) => {
        let arr = [];
        let pageIndex = selectedArticleType?.elements.indexOf(currentArticleType); // 1
        for (let i = pageIndex - 1; i >= 0; i--) {
            let data =
                articleInfo?.articlePublished_data_id?.[
                selectedArticleType?.elements[i]
                ];
            if (data) {
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = data;
                const dataIdArray = [];
                // const elementsWithDataId = tempDiv.querySelectorAll('[data-id]');
                const elementsWithDataId = tempDiv.querySelectorAll(
                    "[data-id][widget-type=figure]"
                );
                elementsWithDataId.forEach((element) => {
                    dataIdArray.push(element.getAttribute("data-id"));
                });
                arr = [...arr, ...dataIdArray];
            }
        }
        return arr.length;
    };

    const htmlContentParser = (htmlString, item) => {
        let data = htmlString == undefined ? "<p></p>" : htmlString;

        let tableCount = calcPreviousTableCount(item);
        let figureCount = calcPreviousFigureCount(item);

        var pat = /\([0-9-0-9, ]*\)/g;
        data = data.replace(pat, "<a href='#references'>$&</a>");

        const parsedHtml = parse(data, {
            replace: (node, index) => {
                if (
                    node.type === "tag" &&
                    node.name === "section" &&
                    node.attribs["data-id"] &&
                    node.attribs["widget-type"] === "table"
                ) {
                    tableCount++;
                    const dataId = node.attribs["data-id"];
                    let tableData = articleInfo.articlePublished_data_id.table_list.find(
                        ({ _id }) => _id === dataId
                    );
                    if (tableData) {
                        return (
                            <ArticleTableView tableData={tableData} tableNo={tableCount} />
                        );
                    }
                }

                if (
                    node.type === "tag" &&
                    node.name === "section" &&
                    node.attribs["data-id"] &&
                    node.attribs["widget-type"] === "figure"
                ) {
                    figureCount++;
                    const dataId = node.attribs["data-id"];
                    let figureData =
                        articleInfo.articlePublished_data_id.figures_list.find(
                            ({ _id }) => _id === dataId
                        );
                    if (figureData) {
                        return (
                            <ArticleFigureView
                                figureData={figureData}
                                figureNo={figureCount}
                            />
                        );
                    }
                }
                return undefined;
            },
        });
        return <div>{parsedHtml}</div>;
    };

    return (
        <>
            <div
                className="row pb-md-4"
                style={{
                    zIndex: 900,
                }}
            >
                {/* Relevant article sidebar */}
                <aside className="col-lg-3 mb-4" style={{ marginTop: "-115px" }}>
                    <div
                        className="position-sticky mx-4 px-4 top-0"
                        style={{ paddingTop: 125 }}
                    >

                        <div className="position-lg-sticky top-0">
                            <div
                                className="offcanvas-lg offcanvas-start"
                                id="sidebarAccount"
                            >
                                <button
                                    className="btn-close position-absolute top-0 end-0 mt-3 me-3 d-lg-none"
                                    type="button"
                                    data-bs-dismiss="offcanvas"
                                    data-bs-target="#sidebarAccount"
                                />
                                <div className="offcanvas-body ml-4">
                                    <li className="nav flex-column pb-1 mb-1">
                                        <span className="nav-link px-0 py-1">
                                            <i className="ai-grid fs-lg opacity-90 me-2"></i>Title
                                        </span>
                                        <ul className="nav flex-column border-start ps-3 ms-2 mb-2">
                                            <li className="nav-item">
                                                <a
                                                    className={`nav-link fs-sm fw-normal py-0 ps-1 pe-0 mb-1 ${location.pathname ===
                                                        `/main/article/${articleId}/process#title`
                                                        ? "active"
                                                        : ""
                                                        } `}
                                                    href="#"
                                                    data-scroll="data-scroll"
                                                >
                                                    Title
                                                </a>
                                            </li>
                                            <li className="nav-item">
                                                <a
                                                    className={`nav-link fs-sm fw-normal py-0 ps-1 pe-0 mb-1 pointer ${location.pathname ===
                                                        `/main/article/${articleId}/process#abstract`
                                                        ? "active"
                                                        : ""
                                                        }`}
                                                    data-scroll="data-scroll"
                                                    onClick={() => scrollToSection('abstract')}
                                                >
                                                    Abstract
                                                </a>
                                            </li>
                                            <li className="nav-item">
                                                <a
                                                    className={`nav-link fs-sm fw-normal py-0 ps-1 pe-0 mb-1 pointer ${location.pathname ===
                                                        `/main/article/${articleId}/process#keyword`
                                                        ? "active"
                                                        : ""
                                                        } `}
                                                    data-scroll="data-scroll"
                                                    onClick={() => scrollToSection('keyword')}
                                                >
                                                    Keywords
                                                </a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li className="nav flex-column pb-1 mb-1">
                                        <span className="nav-link px-0 py-1">
                                            <i className="ai-file-text fs-lg opacity-90 me-2"></i>
                                            Article
                                        </span>
                                        <ul className="nav flex-column border-start ps-3 ms-2 mb-2">
                                            {selectedArticleType?.elements?.map((item, index) => {
                                                return (
                                                    <li className="nav-item" key={"pageLink" + item}>
                                                        <a
                                                            className={`nav-link text-capitalize fs-sm fw-normal py-0 ps-1 pe-0 mb-1 pointer ${location.pathname ===
                                                                `/published/article/${articleId}/view#${item}`
                                                                ? "active"
                                                                : ""
                                                                }`}
                                                            data-scroll="data-scroll"
                                                            onClick={() => scrollToSection(item)}
                                                        >
                                                            {item.replace("_", " ")}
                                                        </a>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </li>
                                    <li className="nav flex-column pb-1 mb-1">
                                        <a
                                            className={`nav-link px-0 py-1 pointer ${location.pathname ===
                                                `/main/article/${articleId}/process#reference`
                                                ? "active"
                                                : ""
                                                }`}
                                            data-scroll="data-scroll"
                                            onClick={() => scrollToSection('reference')}
                                        >
                                            <i className="ai-list fs-lg opacity-90 me-2"></i>
                                            References
                                        </a>
                                    </li>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
                {/* Relevant article data */}
                <div className="col-lg-9 pb-2 pb-md-0 mb-4 mb-md-0">
                    <div className="card shadow border-1 mb-4">
                        <div className="card-body">
                            <h2
                                id="abstract"
                                key="abstract"
                                className="h5 text-center text-sm-start mb-4 text-capitalize"
                            >
                                Abstract
                            </h2>
                            {
                                <span
                                    style={{
                                        textAlign: "justify",
                                        textJustify: "inter-word",
                                    }}
                                    dangerouslySetInnerHTML={{
                                        __html: articleInfo?.abstract,
                                    }}
                                />
                            }

                            <div className="d-flex flex-wrap pt-3 pt-md-3 pt-xl-3 mt-xl-n2 mb-4 ">
                                <h2
                                    id="keyword"
                                    key="keyword"
                                    className="h5 py-1 mb-0 me-4 text-capitalize"
                                >
                                    Keywords:
                                </h2>
                                {articleInfo?.keywords?.map((keyword, index) => {
                                    return (
                                        <Link key={`articleInfoKeyword_${index}`} to={`/articles?article_keyword=${encodeURIComponent(keyword)}`} className="nav-link fs-sm py-1 px-0 me-3">
                                            <span className="text-primary">#</span>
                                            {keyword}
                                        </Link>
                                    );
                                })}
                            </div>

                            {selectedArticleType?.elements?.map((item, index) => {
                                return (
                                    <div
                                        className={`tab-pane fade show ${index == 0 ? "active" : ""
                                            }`}
                                        id={`selectedArticleTypeElements${index}`}
                                        key={`selectedArticleTypeElements${index}`}
                                        role="tabpanel"
                                    >
                                        <h2
                                            id={`${item}`}
                                            key={`${item}`}
                                            className="h5 text-center text-sm-start mb-2 text-capitalize"
                                        >
                                            {item.replace("_", " ")}
                                        </h2>
                                        <div
                                            className="mb-4"
                                            style={{
                                                textAlign: "justify",
                                                textJustify: "inter-word",
                                            }}
                                        >
                                            {htmlContentParser(
                                                articleInfo?.articlePublished_data_id[`${item}`],
                                                item
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            <div className="d-flex flex-wrap pt-3 pt-md-3 pt-xl-3 mt-xl-n2 mb-4 ">
                                <h2
                                    id="references"
                                    key="references"
                                    className="h5 py-1 mb-0 me-4 text-capitalize"
                                >
                                    References:
                                </h2>
                                <div
                                    className="mb-4"
                                    style={{
                                        textAlign: "justify",
                                        textJustify: "inter-word",
                                    }}
                                >
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
        </>
    );
};

export default ViewArticle;
