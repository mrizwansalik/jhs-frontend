/* eslint-disable */
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import Masonry from 'react-masonry-css';

import moment from 'moment';

import { getCurrentIssuesArticles } from 'store/home/publishedArticle/actions';

import styles from './style/ArticleGrid.module.css'; // Import the CSS module
import TrendingTopics from './TrendingTopics';
import HomePageLeftSidebar from './HomePageLeftSidebar';

const HomePageArticle = () => {
   const dispatch = useDispatch();
   const home = useSelector((state) => state.home);

   useEffect(() => {
      dispatch(getCurrentIssuesArticles({ body: {}, options: { __module: 'home' } }));
   }, []);

   const breakpointColumnsObj = {
      default: 2,   // Default number of columns for large screens
      1600: 2,      // Large screens (desktops)
      1200: 2,      // Large screens (desktops)
      992: 2,       // Medium screens (desktops)
      768: 1,       // Small screens (tablets)
      576: 1,       // Extra small screens (mobile phones)
      500: 1,       // Additional breakpoint for very small screens
      400: 1        // Additional breakpoint for smaller mobile devices
   };

   return (
      <>
         <section className="container mt-2 mt-md-0 pb-5">
            <div className="row mt-sm-2 mt-lg-0 pt-4 pt-lg-5 pb-md-4">
               <div className="col-md-8 pb-2 pb-md-0 mb-4 mb-md-0">
                  <Masonry
                     breakpointCols={breakpointColumnsObj}
                     className={`${styles.myMasonryGrid} `}
                     columnClassName={`${styles.myMasonryGridColumn} `}
                  >
                     {
                        home?.currentIssuesList && home?.currentIssuesList?.map((article, index) => {
                           return (
                              <article
                                 className="card border-1 shadow w-100 mb-3"
                                 key={"published-current-issues-" + article._id}
                                 style={{
                                    width: '100%'
                                 }}
                              >
                                 <div className="">
                                    <div className="card-body p-4">
                                       <div className="d-flex align-items-center mb-2 mt-n1">
                                          <span className="fs-sm text-muted">
                                             {`${moment(article?.publishedAt).fromNow()}`}
                                          </span>
                                          <span className="fs-xs opacity-20 mx-3">|</span>
                                          <span className="badge border-primary text-primary fs-xs border mt-2">
                                             {article?.type}
                                          </span>
                                       </div>
                                       <Link to={"/published/article/" + article?._id + "/view"}>
                                          <img
                                             className="rounded-5 m-2"
                                             src="assets/img/article_image.jpg"
                                             alt={article?.title ?? "Untitled Article"}
                                             style={{
                                                width: '100%'
                                             }}
                                          />
                                       </Link>
                                       <h3 className="h6 card-title mt-3">
                                          <Link to={"/published/article/" + article?._id + "/view"}>{article?.title ?? "Untitled Article"}</Link>
                                       </h3>
                                       <div className="d-flex flex-wrap align-items-center mt-n2">
                                          <div className="d-flex align-items-end me-3 text-wrap text-break">
                                             <Link to={article?.doi}>{article?.doi}</Link>
                                          </div>
                                       </div>
                                    </div>
                                    <div className="card-footer p-4 m-0">
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
                  </Masonry>
               </div>
               {/* Relevant articles sidebar */}
               <aside className="col-md-4 ml-3 "
                  style={{ marginTop: "-115px" }}
               >
                  <div className="position-sticky top-0 ps-md-4 ps-xl-0"
                     style={{ paddingTop: 125 }}
                  >
                     <HomePageLeftSidebar />
                  </div>
               </aside>
            </div>
         </section>

         <div className="container px-5 pt-2 pb-2 mt-4">
            <div className=" mb-md-2 mb-xl-4">
               <div className="bg-secondary" >
               </div>
               <TrendingTopics />
            </div>
         </div>
      </>
   );
};

export default HomePageArticle;