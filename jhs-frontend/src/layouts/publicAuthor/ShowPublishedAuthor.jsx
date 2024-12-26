/* eslint-disable */
import React, { Suspense, useEffect, useState } from "react";
import { Outlet, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";

import Header from '../../components/header/Header';
import Toasts from '../../components/Notification/Toasts';
import Footer from '../../components/footer/Footer';
import BackToTop from 'components/BackToTop/BackToTop';

import ComponentLoading from "components/loading/ComponentLoading";
import { getPublicSingleAuthor } from "store/home/author/actions";
import AuthorTab from "pages/home/authors/AuthorTab";

const ShowPublishedAuthor = () => {

   const dispatch = useDispatch();
   let { authorId } = useParams();

   const author = useSelector((state) => state.homeAuthor.single);

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
      dispatch(getPublicSingleAuthor({ body: {}, options: { id: authorId, __module: "home", componentLoader: true } }));
   }, []);

   return (
      <>
         <ComponentLoading />
         <main className="page-wrapper" style={{ minHeight: '100vh' }}>
            {/* Navbar. Remove 'fixed-top' class to make the navigation bar scrollable with the page*/}
            <Header />
            {/* Page content*/}
            <div className="container pt-5 pb-lg-5 pb-md-4 pb-2 my-5">
               <div className="row">
                  <div className="col-lg-3 pt-4 pb-2 pb-sm-4">
                     <section className="card border-0 shadow mb-4">
                        <div className="card-body">
                           <div className="pb-2 pb-lg-0 mb-4 mb-lg-3">
                              <img
                                 className="d-block rounded-circle mb-2"
                                 src={`${(author?.file) ? `${import.meta.env.VITE_REACT_APP_URL}/public/uploads/profile/${author?.file}` : '/assets/img/avatar/user.png'}`}
                                 style={{
                                    width: 80,
                                    height: 80,
                                 }}
                                 alt={author?.full_name} />
                              <h3 className="h5 mb-1">{author?.full_name}</h3>
                              <p className="fs-sm text-muted mb-0">{author?.email}</p>
                           </div>
                           <div className="row pt-4">
                              <div className="col-12 mb-4 mb-md-0">
                                 <div class="d-flex align-items-center mb-3">
                                    <i className="ai-briefcase text-primary lead" />
                                    <div class="ps-3 fs-sm">
                                       <div className="text-dark">{author?.occupation}</div>
                                       <div className="text-body-secondary">Occupation</div>
                                    </div>
                                 </div>
                                 <div class="d-flex align-items-center mb-3">
                                    <i className="ai-book text-primary lead" />
                                    <div class="ps-3 fs-sm">
                                       <div className="text-dark">{author?.department}</div>
                                       <div className="text-body-secondary">Department</div>
                                    </div>
                                 </div>
                                 <div class="d-flex align-items-center mb-3">
                                    <i className="ai-home text-primary lead" />
                                    <div class="ps-3 fs-sm">
                                       <div className="text-dark">{author?.institute}</div>
                                       <div className="text-body-secondary">Institute</div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </section>
                     <section className="card border-0 shadow mb-4">
                        <div className="card-body">
                           <div className="d-flex align-items-center mb-3">
                              <i className="ai-star text-primary lead pe-1 me-2" />
                              <h2 className="h6 mb-0">Rating</h2>
                           </div>
                           <div className="row pt-4">
                              <div className="col-12 mb-4 mb-md-0">
                                 <div class="d-flex align-items-center mb-3">
                                    <p className="text-primary lead mb-0">5.5</p>
                                    <div class="ps-3 fs-sm">
                                       <div className="text-dark">5 articles</div>
                                       <div className="text-body-secondary">Publication Rating</div>
                                    </div>
                                 </div>
                                 <div class="d-flex align-items-center mb-3">
                                    <p className="text-primary lead mb-0">5.5</p>
                                    <div class="ps-3 fs-sm">
                                       <div className="text-dark">5 articles</div>
                                       <div className="text-body-secondary">Review Rating</div>
                                    </div>
                                 </div>
                                 <div class="d-flex align-items-center mb-3">
                                    <p className="text-primary lead mb-0">5.5</p>
                                    <div class="ps-3 fs-sm">
                                       <div className="text-dark">5 articles</div>
                                       <div className="text-body-secondary">Article Rating</div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </section>
                  </div>
                  <div className="col-lg-9 pt-4 pb-2 pb-sm-4">
                     <AuthorTab />
                     <Outlet />
                  </div>
               </div>
            </div>
         </main>
         <BackToTop />
         <Toasts />
         <Footer />
      </>
   );
};

export default ShowPublishedAuthor;

