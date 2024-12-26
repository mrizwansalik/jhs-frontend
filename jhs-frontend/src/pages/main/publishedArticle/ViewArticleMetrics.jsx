/* eslint-disable */
import React from "react";
import { useSelector } from "react-redux";

import WorldMapStats from "./map/WorldMapStats";
import LineChart from "./Charts/LineChart";
import GCCRegionMapCard from "./map/GCCRegionMapCard";

const ViewArticleMetrics = () => {
    const articleTotalViews = useSelector((state) => state.home.singleArticleTotalViews);
    const articleTotalDownloads = useSelector((state) => state.home.singleArticleTotalDownloads);

    const saudiRegionMetrics = useSelector((state) => state.home.singleArticleSaudiRegionMetrics);

    const gulfTotalViews = saudiRegionMetrics.reduce((acc, item) => acc + item.views, 0);
    const gulfTotalDownloads = saudiRegionMetrics.reduce((acc, item) => acc + item.downloads, 0);

    const metricsData = [
        {
            title: "Total Views",
            value: articleTotalViews,
            description: "Number of times the article has been viewed."
        },
        {
            title: "Total Downloads",
            value: articleTotalDownloads,
            description: "Number of times the article has been downloaded."
        },
        {
            title: "Total Views in Saudi Arab",
            value: gulfTotalViews,
            description: "Number of views for the article across all of Saudi Arab Regions."
        },
        {
            title: "Total Downloads in Saudi Arab",
            value: gulfTotalDownloads,
            description: "Number of views for the article across all of Saudi Arabia Regions."
        }
    ];

    return (
        <>
            <div
                className="row pb-md-4"
                style={{
                    zIndex: 900,
                }}
            >
                {/* Relevant article sidebar */}
                <aside className="col-lg-3 col-md-12 col-sm-12 mb-4" style={{ marginTop: "-115px" }}>
                    <div
                        className="position-sticky mx-0 px-2 top-0"
                        style={{ paddingTop: 125 }}
                    >
                        <div className="position-lg-sticky top-0">
                            <div className="ml-4">
                                {
                                    metricsData.map((metric, index) => (
                                        <div className="card h-100 shadow rounded-3 p-3 my-3 p-sm-4" key={index}>
                                            <div className="d-flex align-items-center pb-2 mb-1">
                                                <h3 className="h6 text-nowrap text-truncate mb-0">
                                                    {metric.title}
                                                </h3>
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <div className="text-center mb-2">
                                                    <div className="bg-secondary rounded-1 p-4">
                                                        <div className="h2 fw-normal mb-0 mx-1">{metric.value}</div>
                                                    </div>
                                                </div>
                                                <div className="ps-3 fs-sm">
                                                    <div className="text-dark">{metric.description}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </aside>
                {/* Relevant article data */}
                <div className="col-lg-9 col-md-12 col-sm-12 pb-2 pb-md-0 mb-4 mb-md-0">
                    <LineChart />
                    <WorldMapStats />
                    <GCCRegionMapCard />
                </div>
            </div>
        </>
    );
};

export default ViewArticleMetrics;
