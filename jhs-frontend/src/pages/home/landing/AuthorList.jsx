/* eslint-disable */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getPublicAuthor } from 'store/home/publishedArticle/actions';

const AuthorList = () => {

   const dispatch = useDispatch();
   const auth = JSON.parse(localStorage.getItem('auth'));
   const publicAuthor = useSelector((state) => state.home.publicAuthor);

   const authorListAction = getPublicAuthor({
      body: {},
      options: { __module: "home" },
   });

   useEffect(() => {
      dispatch(authorListAction);
   }, [dispatch]);

   return (

      <section className="container py-5 mb-lg-3 mb-xl-4 mt-xl-3 my-xxl-5">
         <h2 className="h1 text-center pt-2 pt-sm-3 pt-md-4 pt-lg-5 mt-xl-2 mb-5">
            Featured Authors & Reviewers
         </h2>
         <div className="mb-4 mb-lg-5 pb-4 px-3" data-simplebar="init">
            <div
               className="simplebar-wrapper"
               style={{ margin: "0px -16px -24px" }}
            >
               <div className="simplebar-height-auto-observer-wrapper">
                  <div className="simplebar-height-auto-observer" />
               </div>
               <div className="simplebar-mask">
                  <div className="simplebar-offset" style={{ right: 0, bottom: 0 }}>
                     <div
                        className="simplebar-content-wrapper"
                        tabIndex={0}
                        role="region"
                        aria-label="scrollable content"
                        style={{ height: "auto", overflow: "hidden" }}
                     >
                        <div
                           className="simplebar-content"
                           style={{ padding: "0px 16px 24px" }}
                        >
                           <div className="row row-cols-lg-4 flex-nowrap flex-lg-wrap gy-lg-5 mx-n3">


                              {
                                 publicAuthor.map((author) => (
                                    <div key={author._id} className="col">
                                       <Link
                                          className="d-block text-center text-decoration-none"
                                          to={"/published/author/" + author?._id + "/view"}
                                          style={{ minWidth: 210 }}
                                       >
                                          <img
                                             className="rounded-circle"
                                             src={`${author?.file ? `${import.meta.env.VITE_REACT_APP_URL}/public/uploads/profile/${author?.file}` : '/assets/img/avatar/user.png'}`}
                                             width={120}
                                             alt={`${author.name} Profile image`}
                                          />
                                          <h3 className="h5 pt-4 mb-1">{author.full_name}</h3>
                                          <p className="text-body-secondary mb-0">

                                             {author.occupation}, {author.department}
                                          </p>
                                       </Link>
                                    </div>
                                 ))
                              }
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               <div
                  className="simplebar-placeholder"
                  style={{ width: 1296, height: 472 }}
               />
            </div>
            <div
               className="simplebar-track simplebar-horizontal"
               style={{ visibility: "hidden" }}
            >
               <div
                  className="simplebar-scrollbar"
                  style={{ width: 0, display: "none" }}
               />
            </div>
            <div
               className="simplebar-track simplebar-vertical"
               style={{ visibility: "hidden" }}
            >
               <div
                  className="simplebar-scrollbar"
                  style={{ height: 0, display: "none" }}
               />
            </div>
         </div>
         <div className="card bg-primary overflow-hidden py-2 py-sm-3 py-md-4 mb-sm-2 mb-md-4">
            <div className="bg-dark position-absolute top-0 start-0 w-100 h-100 opacity-5" />
            <div
               className="position-absolute top-0 start-0 w-100 h-100 opacity-15"
               style={{
                  backgroundImage: "url(assets/img/landing/conference/noise.png)",
                  mixBlendMode: "soft-light",
               }}
            />
            <div className="card-body position-relative d-sm-flex align-items-center justify-content-between z-2 text-center">
               <div className="d-md-flex align-items-center pe-md-4">
                  <div className="d-none d-md-block text-warning flex-shrink-0 me-3">
                     <svg
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                     >
                        <path d="M12 0L12.6798 4.12733C13.2879 7.81883 16.1812 10.7121 19.8727 11.3202L24 12L19.8727 12.6798C16.1812 13.2879 13.2879 16.1812 12.6798 19.8727L12 24L11.3202 19.8727C10.7121 16.1812 7.81882 13.2879 4.12733 12.6798L0 12L4.12733 11.3202C7.81883 10.7121 10.7121 7.81882 11.3202 4.12733L12 0Z" />
                     </svg>
                  </div>
                  <h2 className="text-light pb-1 pb-md-0 mb-md-0">
                     Do you have an research you want to submit?
                  </h2>
               </div>
               {auth && auth.user && auth.authenticated ?
                  <Link className="btn btn-lg btn-primary me-xl-4" to="/main/article/getStarted">
                     Submit Article
                  </Link>
                  :
                  <Link to='/login' className="btn btn-lg btn-primary me-xl-4" ><i className="ai-play fs-xl me-2 ms-n1" />Submit Article</Link>
               }
            </div>
         </div>
      </section>
   );
};

export default AuthorList;
