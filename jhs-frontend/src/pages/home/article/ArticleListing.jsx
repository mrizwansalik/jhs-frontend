/* eslint-disable */
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";

// functions
import { useForm } from "react-hook-form";
import { getArticleList, getTrendingCategoriesList } from "store/home/publishedArticle/actions";
import ArticlePagination from "components/pagination/ArticlePagination";
import ArticleFilter from "components/Filter/ArticleFilter";
import moment from "moment";
import { applyFilters } from "store/filters/actions";

const ArticleListing = () => {
  const dispatch = useDispatch();
  const childCompRef = useRef();
  const [searchParams] = useSearchParams();
  useEffect(() => {
    // Check if there's a query parameter in the URL on load
    const urlParams = new URLSearchParams(window.location.search);
    const articleKeyword = urlParams.get("article_keyword");
    const articleCategory = urlParams.get("article_category");
    dispatch(
      applyFilters({
        filter: {
          article_keyword: articleKeyword,
          article_category: articleCategory,
        },
      })
    );
  }, [searchParams]);

  const [isFilter, setIsFilter] = useState(true);
  const articles = useSelector((state) => state.home);
  const filter = useSelector((state) => state.filters);
  const categoryList  = useSelector((state) => state.home.trendingCategoriesList);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ reValidateMode: "onChange" });

  const filterVisibility = () => {
    isFilter === false ? setIsFilter(true) : setIsFilter(false);
  };

  const articleListAction = getArticleList({
    body: {},
    options: { __module: "home", pagination: true },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getTrendingCategoriesList({ body: {}, options: { __module: 'home' } }));
    dispatch(articleListAction);
  }, [dispatch]);

  return (
    <>
      <div className="container pt-5 pb-lg-5 pb-md-4 pb-2 my-5">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb">
          <ol className="pt-lg-3 pb-lg-4 pb-2 breadcrumb">
            <li className="breadcrumb-item">
              <a href="index.html">Home</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Articles
            </li>
          </ol>
        </nav>
        {/* Page title + filters */}
        <div className="row align-items-center gy-2 mb-4 pb-1 pb-sm-2 pb-lg-3">
          <div className="col-lg-3">
            <h1 className="h4">Articles Information</h1>
          </div>
          <ArticleFilter
            visibility={isFilter}
            ref={childCompRef}
            search={false}
            fetchAction={articleListAction}
          >
            <div className="col-xl-2 col-lg-3 col-sm-5">
              <select
                className="form-select"
                onChange={(event) =>
                  childCompRef.current.getAdditionalFilterData("type", event)
                }
              >
                <option value={""}>All Type</option>
                <option>Original Article</option>
                <option>Review Article</option>
                <option>Case Report</option>
                <option>Technical Report</option>
                <option>Editorial</option>
              </select>
            </div>
            <div className="col-lg-2 col-sm-7">
              <div className="position-relative">
                <select
                  className="form-select"
                  onChange={(event) =>
                    childCompRef.current.getAdditionalFilterData(
                      "article_category",
                      event
                    )
                  }
                >
                    <option value={""}>All Type</option>
                    {
                        categoryList.map((category) => (
                                <option key={`select_category_${category._id}`} value={category._id}>{category?.name} ({category?.no_of_publications ?? 0})</option>
                        ))
                    }
                </select>
              </div>
            </div>
            <div className="col-lg-4 col-sm-12">
              <div className="position-relative">
                <i className="ai-search position-absolute top-50 start-0 translate-middle-y ms-3" />
                <input
                  className="form-control ps-5"
                  type="article_keyword"
                  placeholder="Enter keyword"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      childCompRef.current.getAdditionalFilterData(
                        "article_keyword",
                        event
                      );
                    }
                  }}
                />
              </div>
            </div>
          </ArticleFilter>
        </div>

        {articles &&
          articles?.articleList?.map((data, index) => {
            return (
              <article
                key={"article-" + data._id}
                className="row g-0 border-0 pt-3 pt-sm-0 mb-4"
              >
                <Link
                  className="col-sm-3 bg-repeat-0 bg-size-cover bg-position-center rounded-5"
                  to={"/published/article/" + data?._id + "/view"}
                  style={{
                    backgroundImage: "url(assets/img/article_image.jpg)",
                    minHeight: "5rem",
                    
                  }}
                  aria-label={data?.title ?? "Untitled Article"}
                />
                <div className="col-sm-9">
                  <div className="pt-4 pb-sm-4 ps-sm-4 pe-lg-4">
                    <h3 className="h5">
                      <Link to={"/published/article/" + data?._id + "/view"}>
                        {data?.title ?? "Untitled Article"}
                      </Link>
                    </h3>
                    <p className="d-sm-none d-md-block">{data?.doi}</p>
                    <div className="d-flex flex-wrap align-items-center mt-n2">
                      <a
                        className="nav-link text-body-secondary fs-sm fw-normal p-0 mt-2 me-3"
                        href="#"
                      >
                        {data?.views ?? "0"}
                        <i className="ai-show fs-lg ms-1" />
                      </a>
                      <a
                        className="nav-link text-body-secondary fs-sm fw-normal d-flex align-items-end p-0 mt-2"
                        href="#"
                      >
                        {data?.downloads ?? "0"}
                        <i className="ai-download fs-lg ms-1" />
                      </a>
                      <span className="fs-xs opacity-20 mt-2 mx-3">|</span>
                      <span className="fs-sm text-body-secondary mt-2">
                        {moment(data?.publishedAt).format("LL")}
                      </span>
                      <span className="fs-xs opacity-20 mt-2 mx-3">|</span>
                      <a className="badge text-nav fs-xs border mt-2" href="#">
                        {data.type}
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        <ArticlePagination
          fetchAction={articleListAction}
          ref={childCompRef}
          extraParams={{ __module: "home" }}
          visibility={isFilter}
          search={false}
          pagination={{
            ...articles?.pagination,
            total: articles?.articleList?.length,
          }}
        />
      </div>
    </>
  );
};

export default ArticleListing;
