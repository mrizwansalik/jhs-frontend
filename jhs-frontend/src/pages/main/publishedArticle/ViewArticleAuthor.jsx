/* eslint-disable */
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    getPublishedArticleAuthors,
} from "store/home/publishedArticle/actions";

const ViewArticleAuthor = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    let { articleId } = useParams();

    const authorList = useSelector((state) => state.home.singleAuthorList);

    useEffect(() => {
        dispatch(
            getPublishedArticleAuthors({
                body: {},
                options: { id: articleId, btnLoader: true, __module: "home" },
            })
        );
    }, [dispatch]);

    function showAuthorProfile(authorInfo) {
        navigate("/published/author/" + authorInfo + "/view");
    }

    return (
        <div className="row d-flex justify-content-center">
            {
                authorList?.map((data, index) => {
                    return (
                        <div key={`authorList_${index}`} className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-3 mb-4">
                            <div className="card h-100 border shadow mx-auto">
                                <div className="card-body pointer"
                                    onClick={() => showAuthorProfile(data?.id)}
                                >
                                    <div
                                        className="d-block text-center text-decoration-none"
                                        data-scroll="data-scroll"
                                    >
                                        <img
                                            className="rounded-circle"
                                            src={`${data?.file ? `${import.meta.env.VITE_REACT_APP_URL}/public/uploads/profile/${data?.file}` : '/assets/img/avatar/user.png'}`}
                                            width={100}
                                            alt={`${data.name} Profile image`}
                                        />
                                        <h3 className="h5 pt-4 mb-1">{data.name}{data.isMainAuthor ? <i className="ai-circle-check-filled fs-base text-success ms-2"></i> : ``}</h3>
                                        <p className="text-body-secondary mb-0">{data.email}</p>
                                        <p className="text-body-secondary mb-0">{data.occupation}, {data.department}</p>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    );
};

export default ViewArticleAuthor;
