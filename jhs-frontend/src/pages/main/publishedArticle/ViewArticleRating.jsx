/* eslint-disable */
import React, { useMemo } from "react";
import { useSelector } from "react-redux";

import ToArticleRating from "../articleRating/listing/ToArticleRating";
import { Link } from "react-router-dom";
import DisplayStar from "components/RatingStar/DisplayStar";
import moment from "moment";

const ViewArticleRating = () => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    const articleInfo = useSelector((state) => state.home.single);

    // Memoized value to avoid recalculations
    const checkYouRated = useMemo(() => {
        if (auth && articleInfo?.rating) {
            return articleInfo.rating.some((rating) => {
                return rating?.rater_id?._id === auth?.user?.id;
            });
        }
        return false;
    }, [auth, articleInfo]);

    return (
        <div className="container-fluid">
            <div className="row pb-md-4">
                {/* Article Ratings */}
                <div className="col-12">
                    <div className="card shadow-sm rounded-3 mb-4">
                        <div className="card-body">
                            <h2 className="h5 card-title mb-4">Article Ratings</h2>

                            {/* Authentication & Rating Section */}
                            {!auth ? (
                                <div className="p-4 text-center">
                                    <Link to="/login" className="btn btn-primary">
                                        Login to rate Article
                                    </Link>
                                </div>
                            ) : (
                                !checkYouRated && (
                                    <div className="p-4">
                                        <ToArticleRating articleId={articleInfo?._id} />
                                    </div>
                                )
                            )}

                            {/* Display Ratings */}
                            {articleInfo?.rating?.length ? (
                                articleInfo.rating.map((ratingItem) => (
                                    <div key={ratingItem._id} className="p-3 mb-3 border rounded">
                                        {/* Collapsible Link */}
                                        <a
                                            href={`#commentCollapse_${ratingItem._id}`}
                                            className="d-flex align-items-center text-decoration-none text-dark"
                                            data-bs-toggle="collapse"
                                            role="button"
                                            aria-expanded="false"
                                            aria-controls={`commentCollapse_${ratingItem._id}`}
                                        >
                                            {/* User Avatar */}
                                            <div
                                                className="rounded-circle bg-size-cover bg-position-center flex-shrink-0"
                                                style={{
                                                    width: "40px",
                                                    height: "40px",
                                                    backgroundImage: `url(${ratingItem?.rater_id?.file
                                                        ? `${import.meta.env.VITE_REACT_APP_URL}/public/uploads/profile/${ratingItem?.rater_id?.file}`
                                                        : "/assets/img/avatar/user.png"
                                                    })`,
                                                }}
                                            />
                                            {/* User Info */}
                                            <div className="ms-3 w-100">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <h6 className="mb-0">{ratingItem?.rater_id?.full_name ?? "Anonymous User"}</h6>
                                                    <small className="text-muted">
                                                        {moment(ratingItem?.createdAt).format("LLL")}
                                                    </small>
                                                </div>
                                                <DisplayStar rating={ratingItem.score} />
                                                {ratingItem.comment && (
                                                    <p className="text-muted mb-1 small">
                                                        <span className="ai-message"></span> {ratingItem.comment}
                                                    </p>
                                                )}
                                            </div>
                                        </a>

                                        {/* Collapsible Content */}
                                        <div className="collapse mt-2" id={`commentCollapse_${ratingItem._id}`}>
                                            <div className="rounded border bg-secondary px-4">
                                            {ratingItem.rating_list?.length > 0 && (
                                                <div className="table-responsive ">
                                                    <table className="table table-sm table-borderless mt-2">
                                                        <thead>
                                                            <tr className="text-muted small">
                                                                <th>Item</th>
                                                                <th>Score</th>
                                                                <th>Comment</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {ratingItem.rating_list.map((listItem, idx) => (
                                                                <tr key={listItem._id || idx}>
                                                                    <td>{listItem.rating_item?.title ?? "Untitled"}</td>
                                                                    <td><DisplayStar rating={listItem.score} /></td>
                                                                    <td className="text-muted small">{listItem.comment || "N/A"}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-muted">
                                    No ratings available for this article yet.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewArticleRating;
