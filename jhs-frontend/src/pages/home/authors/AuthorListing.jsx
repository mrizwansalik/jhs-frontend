/* eslint-disable */
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";

// functions
import { useForm } from "react-hook-form";
import AuthorPagination from "components/pagination/AuthorPagination";
import AuthorFilter from "components/Filter/AuthorFilter";
import { applyFilters } from "store/filters/actions";
import { getPublicAuthorList } from "store/home/author/actions";

const AuthorListing = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const childCompRef = useRef();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check if there's a query parameter in the URL on load
    const urlParams = new URLSearchParams(window.location.search);
    const authorDetail = urlParams.get("author_detail");
    dispatch(
      applyFilters({
        filter: {
          author_detail: authorDetail
        },
      })
    );
  }, [searchParams]);

  const [isFilter, setIsFilter] = useState(true);
  const authors = useSelector((state) => state.homeAuthor);
  const filter = useSelector((state) => state.filters);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ reValidateMode: "onChange" });

  const filterVisibility = () => {
    isFilter === false ? setIsFilter(true) : setIsFilter(false);
  };

  const authorListAction = getPublicAuthorList({
    body: {},
    options: { __module: "home", pagination: true },
  });

  function showAuthorProfile(authorInfo) {
    navigate("/published/author/" + authorInfo + "/view");
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(authorListAction);
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
              Authors
            </li>
          </ol>
        </nav>
        {/* Page title + filters */}
        <div className="row align-items-center gy-2 mb-4 pb-1 pb-sm-2 pb-lg-3">
          <div className="col-lg-5">
            <h1 className="h4">Author</h1>
          </div>
          <AuthorFilter
            visibility={isFilter}
            ref={childCompRef}
            search={false}
            fetchAction={authorListAction}
          >
            <div className="col-lg-6 col-sm-12">
              <div className="position-relative">
                <i className="ai-search position-absolute top-50 start-0 translate-middle-y ms-3" />
                <input
                  className="form-control ps-5"
                  type="author_detail"
                  placeholder="Enter author detail"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      childCompRef.current.getAdditionalFilterData(
                        "author_detail",
                        event
                      );
                    }
                  }}
                />
              </div>
            </div>
          </AuthorFilter>
        </div>
        <div className="row">
          {authors &&
            authors?.list?.map((data, index) => {
              return (
                <div key={`authorList_${index}`} className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-3 mb-4">
                  <div className="card h-100 border shadow mx-auto">
                    <div className="card-body pointer"
                      onClick={() => showAuthorProfile(data?._id)}
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
                        <h3 className="h5 pt-4 mb-1">{data.full_name}</h3>
                        <p className="text-body-secondary mb-0">{data.email}</p>
                        <p className="text-body-secondary mb-0">{data.occupation} {data.department}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
        </div>

        <AuthorPagination
          fetchAction={authorListAction}
          ref={childCompRef}
          extraParams={{ __module: "home" }}
          visibility={isFilter}
          search={false}
          pagination={{
            ...authors?.pagination,
            total: authors?.list?.length,
          }}
        />
      </div>
    </>
  );
};

export default AuthorListing;
