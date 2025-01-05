/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { checkFeaturePermission } from 'helpers/globalHelpers';

// functions
import { deactivateArticleRatingList, activateArticleRatingList, getAllArticleRatingList } from '../../../store/admin/articleRatingList/actions';
import Filter from 'components/Filter';
import { useForm } from 'react-hook-form';
import Pagination from 'components/pagination/Pagination';

const ArticleRatingList = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const childCompRef = useRef();

    const [isFilter, setIsFilter] = useState(false);
    const articleRatingList = useSelector((state) => state.articleRatingList);
    const permission = useSelector((state) => state.profile.role);
    const filter = useSelector(state => state.filters);
  
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
            !checkFeaturePermission('articleratinglist-view') && navigate('/system');
        }
    }, [permission, navigate]);

    const articleRatingListAction = getAllArticleRatingList({
        body: {},
        options: { __module: "articleRatingList", pagination: true },
      });

    useEffect(() => {
        window.scrollTo(0, 0);
        //  !checkFeaturePermission('articleRatingList-view') && navigate('/not-found');
        dispatch(articleRatingListAction)
    }, [dispatch]);

    const handleStatus = (status, id) => {
        if (!status) {
            dispatch(
                deactivateArticleRatingList({
                    body: {},
                    options: { id: id, __module: 'articleRatingList', showToast: true },
                }))
        } else {
            dispatch(
                activateArticleRatingList({
                    body: {},
                    options: { id: id, __module: 'articleRatingList', showToast: true },
                }))
        }
    }

    if (!permission || !articleRatingList) {
        return '';
    }

    return (
        <>
            <div className="col-lg-9 pt-4 pb-2 pb-sm-4">
                {/* Basic info*/}
                <section className="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
                    <div className="card-body">
                        <div className="d-flex align-items-center mt-sm-n1 pb-4 mb-0 mb-lg-1 mb-xl-3"><i className="ai-tag text-primary lead pe-1 me-2" />
                            <h2 className="h4 mb-0">Article Rating List</h2>
                            {checkFeaturePermission('articleratinglist-add') ?
                                <Link to='/system/articleRatingList/create/' className="btn btn-sm btn-secondary ms-auto">Add Article Rating Item</Link>
                                : ''}
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
                        fetchAction={articleRatingListAction}
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
                            <option value="createdAt">Created at - ASC</option>
                            <option value="-name">Name - DESC</option>
                            <option value="-createdAt">Created at - DESC</option>
                            </select>
                        </div>
                        </Filter>
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <tbody><tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                                </tbody><tbody>
                                    {articleRatingList && articleRatingList?.list?.map((data, index) => {
                                        return (
                                            <tr key={"tr-" + data._id}>
                                                <th scope="row">{++index}</th>
                                                <td>{data.title}</td>
                                                <td>{
                                                    checkFeaturePermission('articleratinglist-delete') ?
                                                        <div className="form-check form-switch">
                                                            <input type="checkbox" onChange={() => handleStatus(data.active ? false : true, data._id)} className="form-check-input" id="customSwitch1" checked={data.active ? true : false} />
                                                        </div> : ''
                                                }
                                                </td>
                                                <td>
                                                    {
                                                        checkFeaturePermission('articleratinglist-update') ?
                                                            <Link className="btn btn-primary btn-sm btn-icon mb-2 me-2" to={"/system/articleRatingList/" + data._id + "/edit"} data-bs-toggle="tooltip" aria-label="Edit">
                                                                <i className="ai-edit"></i>
                                                            </Link> : ''
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <Pagination
                        fetchAction={articleRatingListAction}
                        extraParams={{ __module: "articleRatingList" }}
                        pagination={{
                            ...articleRatingList?.pagination,
                            total: articleRatingList?.list?.length,
                        }}
                        />
                    </div>
                </section>
            </div>
        </>
    );
};

export default ArticleRatingList;