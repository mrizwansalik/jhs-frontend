/* eslint-disable */
import React from "react";
import { useSelector } from "react-redux";

import ToArticleRating from "../articleRating/listing/ToArticleRating";
import { Link } from "react-router-dom";
const auth = JSON.parse(localStorage.getItem('auth'));

const ViewArticleRating = () => {

    const articleInfo = useSelector((state) => state.home.single);

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
                                <div className="card h-100 shadow rounded-3 p-3 my-3 p-sm-4">
                                    {
                                        auth && auth.user && auth.authenticated ?
                                            <ToArticleRating articleId={articleInfo?._id} />
                                            :
                                            <Link to='/login' className="btn btn-sm btn-primary me-xl-4" ><i className="ai-play fs-xl me-2 ms-n1" />Login to rate Article</Link>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
                {/* Relevant article data */}
                <div className="col-lg-9 col-md-12 col-sm-12 pb-2 pb-md-0 mb-4 mb-md-0">
                    <div className="card h-100 shadow rounded-3 mb-4 mt-4">
                        <div className="card-body pb-0">
                            <h2 className="h5 card-title text-capitalize">Article Rating</h2>
                            {
                                articleInfo?.rating?.map((commentItem, index) => {

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
                    </div>
                </div>
            </div>
        </>
    );
};

export default ViewArticleRating;
