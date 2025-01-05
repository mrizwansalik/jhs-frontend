/* eslint-disable */
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

import moment from 'moment';

// function
import { getCurrentIssuesArticles } from 'store/home/publishedArticle/actions';

const CurrentIssues = () => {
   const dispatch = useDispatch();
   const home = useSelector((state) => state.home);

   useEffect(() => {
      dispatch(getCurrentIssuesArticles({ body: {}, options: { __module: 'home' } }));
   }, []);

   return (
      <>
         {
            home?.currentIssuesList && home?.currentIssuesList?.map((article, index) => {
               return (
                  <article
                     className="masonry-grid-item shuffle-item shuffle-item--visible"
                     key={"published-current-issues-" + article._id}
                     style={{
                        position: "absolute",
                        top: 0,
                        visibility: "visible",
                        willChange: "transform",
                        left: 0,
                        opacity: 1,
                        tranform: `${index != 0 ? 'translate(440px, 0px) scale(1)' : 'null'}`,
                        transitionDuration: "250ms",
                        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                        transitionProperty: "transform, opacity"
                     }}
                  >
                     <div className="card border-0">
                        <div className="card-body pb-4">
                           <div className="d-flex align-items-center mb-4 mt-n1">
                              <span className="fs-sm text-muted">
                                 {`${moment(article?.publishedAt).fromNow()}`}
                              </span>
                              <span className="fs-xs opacity-20 mx-3">|</span>
                              <span className="badge border-primary text-primary fs-xs border mt-2">
                                 {article?.type}
                              </span>
                           </div>

                           <h3 className="h5 card-title">
                              <Link to={"/published/article/" + article?._id + "/view"}>{article?.title ?? "Untitled Article"}</Link>
                           </h3>
                           <div className="d-flex flex-wrap align-items-center mt-n2">
                              <div className="d-flex align-items-end me-3">
                                 <Link to={article?.doi}>{article?.doi}</Link>
                              </div>
                           </div>
                        </div>
                        <div className="card-footer pt-3">
                           <a
                              className="d-flex align-items-center text-decoration-none pb-2"
                              href="#"
                           >
                              <img
                                 className="rounded-circle"
                                 src={`${(article?._author?.file) ? `${import.meta.env.VITE_REACT_APP_URL}/public/uploads/profile/${article?._author?.file}` : '/assets/img/avatar/user.png'}`}
                                 width={48}
                                 alt="Post author"
                              />
                              <h6 className="ps-3 mb-0">{article?._author?.full_name ?? "Untitle name"}</h6>
                           </a>
                        </div>
                     </div>
                  </article>
               )
            })
         }
      </>
   );
};

export default CurrentIssues;