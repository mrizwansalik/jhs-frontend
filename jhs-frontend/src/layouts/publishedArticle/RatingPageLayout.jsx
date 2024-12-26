/* eslint-disable */
import React, { useEffect } from "react";
import { Outlet, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import Header from '../../components/header/Header';
import Toasts from '../../components/Notification/Toasts';
import Footer from '../../components/footer/Footer';
import BackToTop from 'components/BackToTop/BackToTop';

import { getPublishedArticleDetail } from "store/home/publishedArticle/actions";
import ComponentLoading from "components/loading/ComponentLoading";
import ViewArticleRatingTab from "./ViewArticleRatingTab";


const RatingPageLayout = () => {

   const dispatch = useDispatch();
   let { articleId } = useParams();
   const articleInfo = useSelector((state) => state.home.single);

   const articleTotalViews = useSelector((state) => state.home.singleArticleTotalViews);
   const articleTotalDownloads = useSelector((state) => state.home.singleArticleTotalDownloads);

   useEffect(() => {
      const script = document.createElement('script');
      script.src = `${window.location.origin}/assets/js/theme.min.js`;
      script.async = true;
      document.body.appendChild(script);
      return () => {
         document.body.removeChild(script);
      }
   }, []);

   useEffect(() => {
      window.scrollTo(0, 0);
      dispatch(getPublishedArticleDetail({ body: {}, options: { id: articleId, btnLoader: true, __module: "home", componentLoader: true }, }));
   }, []);

   return (
      <>
         <ComponentLoading />
         <Header />
         <main className="page-wrapper" style={{ minHeight: '100vh' }}>
            {/* Page content*/}
            <div className="pt-5 mt-5">
               {/* Main Content goes here */}
               <section className="position-relative pt-5">
                  <div
                     className="position-absolute top-0 start-0 w-100"
                     style={{ height: "100%" }}
                  >
                     <div className="bg-primary position-absolute top-0 start-0 w-100 h-100" />
                     <div
                        className="position-absolute start-0 bottom-0 w-100 overflow-hidden mb-n1"
                        style={{ paddingBottom: "6.2%", color: "var(--ar-gray-100)" }}
                     >
                        <svg
                           className="position-absolute start-0 bottom-0 w-100 h-100"
                           viewBox="0 0 3000 185.4"
                           xmlns="http://www.w3.org/2000/svg"
                        >
                           <path
                              fill="currentColor"
                              d="M3000,0v185.4H0V0c496.4,115.6,996.4,173.4,1500,173.4S2503.6,115.6,3000,0z"
                           />
                        </svg>
                     </div>
                  </div>
                  <div className="container dark-mode position-relative zindex-5">
                     <div className="row justify-content-center text-center pb-5 mb-md-2">
                        <div className="col-lg-10 col-xl-9 col-xxl-8">
                           <span className="badge bg-faded-light fs-sm text-white px-3 mb-4">
                              {articleInfo?.type}
                           </span>
                           <h1 className="display-6 mb-sm-4">
                              {articleInfo?.title}
                           </h1>
                           <p className="m-2">
                              {articleInfo?.doi}
                           </p>
                        </div>
                     </div>
                  </div>
               </section>
               <div className="mx-2 px-2">
                  <section className="container mt-2 mt-md-0 pb-5 mb-md-2 mb-lg-3 mb-xl-4 mb-xxl-5">
                     <div className="position-sticked">
                        <ViewArticleRatingTab articleId={articleId} />
                     </div>
                     <Outlet />
                  </section>
               </div>
            </div>
         </main>
         <BackToTop />
         <Toasts />
         <Footer />
      </>
   );
};

export default RatingPageLayout;

