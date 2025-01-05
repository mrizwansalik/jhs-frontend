import React, { useEffect, useState } from "react";
import { Outlet, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from 'react-helmet-async';

import Header from '../../components/header/Header';
import Toasts from '../../components/Notification/Toasts';
import Footer from '../../components/footer/Footer';
import BackToTop from 'components/BackToTop/BackToTop';

import ExportCitation from "../../pages/main/publishedArticle/operations/ExportCitation";
import ArticleCitationModel from "../../pages/main/publishedArticle/operations/ArticleCitationModel";

import { getPublicArticleType, getPublishedArticleDetail, getPublishedArticleMatrices, getPublishedArticleReferencesTextList } from "store/home/publishedArticle/actions";
import ViewArticleTab from "pages/main/publishedArticle/ViewArticleTab";
import DownloadPDF from "pages/main/publishedArticle/operations/DownloadPDF";
import { setCoordinates } from "store/coordinates/actions";
import ComponentLoading from "components/loading/ComponentLoading";
import DisplayStar from "components/RatingStar/DisplayStar";

// Importing geo located reducer function

const ShowPublishedArticle = () => {

   const dispatch = useDispatch();
   let { articleId } = useParams();
   const articleInfo = useSelector((state) => state.home.single);
   const articleTypes = useSelector((state) => state.home.articleTypeList);

   const [averageRating, setAverageRating] = useState(0);

   const articleTotalViews = useSelector((state) => state.home.singleArticleTotalViews);
   const articleTotalDownloads = useSelector((state) => state.home.singleArticleTotalDownloads);

   // get the current users location
   navigator.geolocation.getCurrentPosition(
      (position) => {
         // save the geolocation coordinates in two variables
         const { latitude, longitude } = position.coords;
         dispatch(setCoordinates({ latitude, longitude }));
      },
      (error) => {
         console.error('Error getting user location:', error);
      },
   );

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
      dispatch(getPublicArticleType({ body: {}, options: { __module: "home" } }));
      dispatch(getPublishedArticleDetail({ body: {}, options: { id: articleId, btnLoader: true, __module: "home", coordinates: true, componentLoader: true }, }));
      dispatch(getPublishedArticleMatrices({ body: {}, options: { id: articleId, btnLoader: true, __module: "home" }, }));
      dispatch(getPublishedArticleReferencesTextList({ body: {}, options: { id: articleId, btnLoader: true, __module: "home" }, }));
   }, []);

   useEffect(() => {
      if (articleTypes?.length && articleInfo !== null) {
         let selectedArticle = articleTypes?.filter(
            (article) => article.name === articleInfo.type
         );
         dispatch({
            type: "SELECTED_PUBLISHED_ARTICLE_TYPE",
            payload: selectedArticle[0],
         });
      }
      

      const totalScores = articleInfo?.rating.reduce((sum, rating) => sum + rating.score, 0);
      const numberOfRatings = articleInfo?.rating.length;
      setAverageRating(numberOfRatings > 0 ? (totalScores / numberOfRatings) : 0);
      
   }, [articleInfo, articleTypes]);

   return (
      <>
         <ComponentLoading />
         <Header />
         <Helmet>
            <title>{`${articleInfo?.title} - ${articleInfo?.type}`}</title>
            <meta name="meta-description" content={articleInfo?.abstract} />
            <meta name="description" content={articleInfo?.abstract} />
            <meta name="keywords" content={articleInfo?.keywords.join(', ')} />
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href={articleInfo?.doi} />

            {/* Open Graph tags for social sharing */}
            <meta property="og:title" content={articleInfo?.title} />
            <meta property="og:description" content={articleInfo?.abstract} />
            <meta property="og:url" content={articleInfo?.doi} />
            <meta property="og:image" content={articleInfo?.doi} />
            <meta property="og:type" content="article" />

            {/* Twitter Card tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={articleInfo?.title} />
            <meta name="twitter:description" content={articleInfo?.title} />
            <meta name="twitter:image" content={articleInfo?.title} />

            {/* Citation metadata for academic purposes */}
            <meta name="citation_title" content={articleInfo?.title} />
            <meta name="citation_author" content={articleInfo?.title} />
            <meta name="citation_journal_title" content={`Journal of Healthcare sciences`} />
            <meta name="citation_date" content={articleInfo?.publishedAt} />
            <meta name="citation_doi" content={articleInfo?.doi} />
         </Helmet>
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

                           <div className="m-2 d-flex justify-content-center">
                              <DisplayStar rating={averageRating} />
                           </div>
                           
                           <div className="pb-3 mb-3 mb-lg-4">
                              <span className="btn btn-secondary bg-faded-light btn-sm mt-3 ms-3">
                                 <i className="ai-show fs-sm opacity-90 me-2" />{" "}
                                 {articleTotalViews ?? "0"}
                              </span>
                              <DownloadPDF articleId={articleInfo?._id} articleView={articleTotalDownloads ?? 0} ActionType="btn btn-secondary bg-faded-light btn-sm mt-3 ms-3" />
                              <ExportCitation articleId={articleInfo?._id} ActionType="btn btn-secondary bg-faded-light btn-sm mt-3 ms-3" />
                              <a
                                 className="btn btn-secondary btn-icon btn-sm btn-instagram bg-faded-light rounded-circle mt-3 ms-3"
                                 href="#"
                              >
                                 <i className="ai-instagram" />
                              </a>
                              <a
                                 className="btn btn-secondary btn-icon btn-sm btn-facebook bg-faded-light rounded-circle mt-3 ms-3"
                                 href="#"
                              >
                                 <i className="ai-facebook" />
                              </a>
                              <a
                                 className="btn btn-secondary btn-icon btn-sm btn-telegram bg-faded-light rounded-circle mt-3 ms-3"
                                 href="#"
                              >
                                 <i className="ai-telegram" />
                              </a>
                              <a
                                 className="btn btn-secondary btn-icon btn-sm btn-twitter bg-faded-light rounded-circle mt-3 ms-3"
                                 href="#"
                              >
                                 <i className="ai-twitter" />
                              </a>
                           </div>
                        </div>
                     </div>
                  </div>
               </section>
               <div className="mx-2 px-2">
                  <section className="container mt-2 mt-md-0 pb-5 mb-md-2 mb-lg-3 mb-xl-4 mb-xxl-5">
                     <div className="position-sticked">
                        <ViewArticleTab articleId={articleId} />
                     </div>
                     <Outlet />
                  </section>
                  <ArticleCitationModel articleId={articleInfo?._id} />
               </div>
            </div>
         </main>
         <BackToTop />
         <Toasts />
         <Footer />
      </>
   );
};

export default ShowPublishedArticle;

