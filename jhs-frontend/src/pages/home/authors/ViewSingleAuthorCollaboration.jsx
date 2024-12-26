/* eslint-disable */
import DownloadPDF from "pages/main/publishedArticle/operations/DownloadPDF";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ViewSingleAuthorCollaboration = () => {

  const author = useSelector((state) => state.homeAuthor.single);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
         {
            author?.userReport?.articles?.collaboration_list && author?.userReport?.articles?.collaboration_list?.map((article) => {
               return (
                  <section key={"author-article-view-" + article._id} className="card card-lifted shadow px-3 py-3 my-3" >
                     <article className="row g-0 border-0 pt-3">
                        <div className="col-12">
                           <div className="card-body px-3 py-2">
                              <div className="row mt-sm-n1 mb-0">
                                 <div className='col-10'>
                                    <h5 className='h5 mb-3'>
                                       <Link to={"/published/article/" + article?._id + "/view"}>{article?.title ?? "Untitled Article"}</Link>
                                    </h5>
                                 </div>
                                 <div className='col-2'>
                                    <div className="d-flex flex-row-reverse mt-sm-n1 mb-0 mb-lg-1 mb-xl-3">
                                       <a
                                          data-bs-toggle="dropdown"
                                          aria-haspopup="true"
                                          aria-expanded="false"
                                       >
                                          <i className="fas fa-ellipsis-v text-primary"></i>
                                       </a>
                                       <div className="dropdown dropdown-menu dropdown-menu-end my-1">
                                          <Link
                                             key={"author_article_preview_" + article?._id}
                                             id={"author_article_preview_" + article?._id}
                                             className="dropdown-item" to={"/published/article/" + article?._id + "/view"}>
                                             <i className="ai-show me-2"></i> Preview
                                          </Link>
                                          <DownloadPDF articleId={article?._id} articleView={article?.downloads ?? 0} />
                                       </div>
                                    </div>
                                 </div>
                              </div>
                              <div className="d-flex flex-wrap align-items-center">
                                 <span className="badge border-primary text-primary fs-xs border mt-2">
                                    {article?.type}
                                 </span>
                                 <span className="fs-xs opacity-20 mt-2 mx-3">|</span>
                                 <span className="badge text-nav fs-xs border mt-2">
                                    <i className="ai-show fs-sm opacity-90 me-2" /> {article?.views ?? '0'}
                                 </span>
                                 <span className="badge text-nav fs-xs border mx-2 mt-2">
                                    <i className="ai-download fs-sm opacity-90 me-2" /> {article?.downloads ?? '0'}
                                 </span>
                              </div>
                           </div>
                        </div>
                     </article>
                  </section>
               )
            })
         }
      </>
  );
};

export default ViewSingleAuthorCollaboration;
