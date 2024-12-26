/* eslint-disable */
import moment from 'moment';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getTrendingCategoriesList } from 'store/home/publishedArticle/actions';

const HomePageLeftSidebar = () => {

   const dispatch = useDispatch();
   const home = useSelector((state) => state.home);
   const categoryList  = useSelector((state) => state.home.trendingCategoriesList);

   useEffect(() => {
      dispatch(getTrendingCategoriesList({ body: {}, options: { __module: 'home' } }));
   }, []);

   return (
      <div className="offcanvas-lg offcanvas-end" id="sidebarBlog">
         <div className="offcanvas-header">
            <h4 className="offcanvas-title">Sidebar</h4>
            <button
               className="btn-close ms-auto"
               type="button"
               data-bs-dismiss="offcanvas"
               data-bs-target="#sidebarBlog"
               aria-label="Close"
            />
         </div>
         <div className="offcanvas-body ml-4">
            {/* Category links */}
            <h4 className="pt-1 pt-lg-0 mt-lg-n2">Categories:</h4>
            <ul className="nav flex-column mb-lg-5 mb-4">
               <li className="mb-2">
                  <Link className="nav-link d-flex p-0" href="#">
                     All categories
                     <span className="fs-sm text-body-secondary ms-2"></span>
                  </Link>
               </li>
               {
                  categoryList.map((category) => (
                        <li key={category._id} className="mb-2">
                           <Link className="nav-link d-flex p-0" to={`/articles?article_category=${encodeURIComponent(category._id)}`}>
                              {category?.name}
                              <span className="fs-sm text-body-secondary ms-2">({category?.no_of_publications ?? 0})</span>
                           </Link>
                        </li>
                  ))
               }
            </ul>
            {/* Featured posts widget */}
            <h4 className="pt-3 pt-lg-0 pb-1">Trending article:</h4>
            <div className="mb-lg-5 mb-4">
            {
               home?.currentIssuesList && home?.currentIssuesList?.slice(0, 2).map((article, index) => {
                  return <article className="position-relative d-flex align-items-center mb-4" key={`trending_article_${article._id}`}>
                     <div className="ps-3">
                        <h4 className="h6 mb-2">
                           <Link className="stretched-link" to={"/published/article/" + article?._id + "/view"}>
                              {article?.title ?? "Untitled Article"}
                           </Link>
                        </h4>
                        <span className="fs-sm text-body-secondary">{`${moment(article?.publishedAt)?.fromNow()}`}</span>
                     </div>
                  </article>
               })
            }
            </div>
            {/* Social buttons */}
            <h4 className="pt-3 pt-lg-0 pb-1">Join us:</h4>
            <div className="d-flex mt-n3 ms-n3 mb-lg-5 mb-4 pb-3 pb-lg-0">
               <a
                  className="btn btn-secondary btn-icon btn-sm btn-instagram rounded-circle mt-3 ms-3"
                  href="#"
                  aria-label="Instagram"
               >
                  <i className="ai-instagram" />
               </a>
               <a
                  className="btn btn-secondary btn-icon btn-sm btn-facebook rounded-circle mt-3 ms-3"
                  href="#"
                  aria-label="Facebook"
               >
                  <i className="ai-facebook" />
               </a>
               <a
                  className="btn btn-secondary btn-icon btn-sm btn-telegram rounded-circle mt-3 ms-3"
                  href="#"
                  aria-label="Telegram"
               >
                  <i className="ai-telegram" />
               </a>
               <a
                  className="btn btn-secondary btn-icon btn-sm btn-x rounded-circle mt-3 ms-3"
                  href="#"
                  aria-label="X"
               >
                  <i className="ai-x" />
               </a>
            </div>
         </div>
      </div>
   );
};

export default HomePageLeftSidebar;