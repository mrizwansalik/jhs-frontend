/* eslint-disable */
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { checkFeaturePermission } from "helpers/globalHelpers";
import Pagination from "components/pagination/Pagination";
import Filter from "components/Filter";

// functions
import { getAllArticleStatus } from "../../../store/admin/articleStatus/actions";

const ArticleStatus = () => {
  const childCompRef = useRef();
  const dispatch = useDispatch();
  const [isFilter, setIsFilter] = useState(false);
  const articleStatus = useSelector((state) => state.articleStatus);
  const permission = useSelector((state) => state.profile.role);
  const filter = useSelector(state => state.filters)

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ reValidateMode: "onChange" });

  const filterVisibility = () => {
    isFilter === false ? setIsFilter(true) : setIsFilter(false);
  };

  useEffect(() => {
    if (permission && permission.length) {
      !checkFeaturePermission("articlestatus-view") && navigate("/system");
    }
  }, [permission]);

  const articleStatusAction = getAllArticleStatus({
    body: {},
    options: { __module: "articleStatus", pagination: true },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(articleStatusAction);
  }, []);

  return (
    <>
      <div className="col-lg-9 pt-4 pb-2 pb-sm-4">
        {/* Article  Type list */}
        <section className="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
          <div className="card-body">
            <div className="d-flex align-items-center mt-sm-n1 pb-4 mb-0 mb-lg-1 mb-xl-3">
              <i className="ai-tag text-primary lead pe-1 me-2" />
              <h2 className="h4 mb-0">Article Status Information</h2>
              {checkFeaturePermission("articlestatus-add") ? (
                <Link
                  className="btn btn-sm btn-secondary ms-auto"
                  to="/system/articleStatus/create"
                >
                  Add Article Status
                </Link>
              ) : (
                ""
              )}
              <button
                onClick={filterVisibility}
                className="btn btn-sm btn-secondary mx-2"
              >
                <i className="ai-filter lead pe-1 me-2"></i>Filter
              </button>
            </div>

            <Filter
              visibility={isFilter}
              ref={childCompRef}
              search={false}
              fetchAction={articleStatusAction}
            >
              <div className="col-md-4">
                <label className="form-label" htmlFor="name">
                  Name
                </label>
                <input
                  onChange={(event) =>
                    childCompRef.current.getAdditionalFilterData(
                      "name",
                      event
                    )
                  }
                  className="form-control form-control-sm"
                  type="text"
                  id="fn"
                />
              </div>
              <div className='col-md-4'>
                <label className=' form-label fs--2'>Order By</label>
                <select
                  value={filter?.sort ? filter?.sort : ''}
                  onChange={(event) =>
                    childCompRef.current.getAdditionalFilterData(
                      "sort",
                      event
                    )
                  } className="form-select form-select-sm"
                  id="sort" size="1" name="organizerSingle" data-options='{"removeItemButton":true,"placeholder":true}'>
                  <option value="_id">None</option>
                  <option value="name">Name - ASC</option>
                  <option value="type">Type - ASC</option>
                  <option value="message">Message - ASC</option>
                  <option value="createdAt">Created at - ASC</option>
                  <option value="-name">Name - DESC</option>
                  <option value="-type">Type - DESC</option>
                  <option value="-message">Message - DESC</option>
                  <option value="-createdAt">Created at - DESC</option>
                </select>
              </div>
            </Filter>
            <div className="table-responsive">
              <table className="table table-hover">
                <tbody>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Message</th>
                    <th>Action</th>
                  </tr>
                </tbody>
                <tbody>
                  {articleStatus &&
                    articleStatus?.list?.map((data, index) => {
                      return (
                        <tr key={"tr-" + data._id}>
                          <th scope="row">{++index}</th>
                          <td>{data?.name}</td>
                          <td>{data?.type}</td>
                          <td>{data?.message}</td>
                          <td>
                            {checkFeaturePermission("articlestatus-update") ? (
                              <Link
                                className="btn btn-primary btn-sm btn-icon mb-2 me-2"
                                to={
                                  "/system/articleStatus/" + data._id + "/edit"
                                }
                                data-bs-toggle="tooltip"
                                aria-label="Edit"
                              >
                                <i className="ai-edit"></i>
                              </Link>
                            ) : (
                              ""
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            <Pagination
              fetchAction={articleStatusAction}
              extraParams={{ __module: "articleStatus" }}
              pagination={{
                ...articleStatus?.pagination,
                total: articleStatus?.list?.length,
              }}
            />
          </div>
        </section>
      </div>
    </>
  );
};

export default ArticleStatus;
