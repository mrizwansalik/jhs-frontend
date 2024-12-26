/* eslint-disable */
import React from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import PublishedArticleTableView from "./preview/PublishedArticleTableView";
import PublishedArticleFigureView from "./preview/PublishedArticleFigureView";
import EmptyList from "components/message/EmptyList";

const ViewArticleMedia = () => {
    let { articleId } = useParams();
    const articleInfo = useSelector((state) => state.home.single);

    if (!articleInfo?.articlePublished_data_id || articleInfo?.articlePublished_data_id?.table_list?.length == 0 && articleInfo?.articlePublished_data_id?.figures_list?.length == 0) {
        return (
            <EmptyList>
                <EmptyList.Header>No Article Media Found</EmptyList.Header>
                <EmptyList.Body>There is no any table and figures in this articles.</EmptyList.Body>
                <EmptyList.Footer>
                    <Link className="btn btn-primary ms-auto mb-4 rounded" to={`/published/article/${articleId}/view`} >
                        Goto Article
                    </Link>
                </EmptyList.Footer>
            </EmptyList>
        );
    }

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
                        className="position-sticky mx-0 px-2 top-0"
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
                                    <div className="card h-100 shadow rounded-3 p-3 my-3 p-sm-4">
                                        <div className="d-flex align-items-center pb-2 mb-1">
                                            <h3 className="h6 text-nowrap text-truncate mb-0">
                                                Total Article Table
                                            </h3>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <div className="text-center mb-2">
                                                <div className="bg-secondary rounded-1 p-4">
                                                    <div className="h2 fw-normal mb-0 mx-1">{articleInfo?.articlePublished_data_id?.table_list.length}</div>
                                                </div>
                                            </div>
                                            <div className="ps-3 fs-sm">
                                                <div className="text-dark">Number of table in article.</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card h-100 shadow rounded-3 p-3 my-3 p-sm-4">
                                        <div className="d-flex align-items-center pb-2 mb-1">
                                            <h3 className="h6 text-nowrap text-truncate mb-0">
                                                Total Article Figure
                                            </h3>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <div className="text-center mb-2">
                                                <div className="bg-secondary rounded-1 p-4">
                                                    <div className="h2 fw-normal mb-0 mx-1">{articleInfo?.articlePublished_data_id?.figures_list.length}</div>
                                                </div>
                                            </div>
                                            <div className="ps-3 fs-sm">
                                                <div className="text-dark">Number of figure in article.</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
                {/* Relevant article data */}
                <div className="col-lg-9 pb-2 pb-md-0 mb-4 mb-md-0">
                    <section className="card shadow border-1 mb-4">
                        <div className="card-header">
                            <h2 className="h4 mb-n2 d-flex">
                                Media Detail
                            </h2>
                        </div>
                        <div className="card-body pt-2">
                            {
                                articleInfo?.articlePublished_data_id?.table_list.map((data, index) => {
                                    return (
                                        <div className="border rounded-3 shadow px-4 py-0 mb-2">
                                            <PublishedArticleTableView tableData={data} tableNo={index + 1} />
                                        </div>
                                    );
                                })
                            }
                            {
                                articleInfo?.articlePublished_data_id?.figures_list.map((data, index) => {
                                    return (
                                        <div className="border rounded-3 shadow px-4 py-0 mb-2">
                                            <PublishedArticleFigureView figureData={data} figureNo={index + 1} />
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
};

export default ViewArticleMedia;
