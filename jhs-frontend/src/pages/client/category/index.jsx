/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { checkFeaturePermission } from 'helpers/globalHelpers';

// functions
import { getCategories, deactivateCategory, activateCategory } from '../../../store/admin/category/actions';
import Filter from 'components/Filter';
import { useForm } from 'react-hook-form';
import Pagination from 'components/pagination/Pagination';

const Category = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const childCompRef = useRef();

    const [isFilter, setIsFilter] = useState(false);
    const categories = useSelector((state) => state.category);
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
            !checkFeaturePermission('category-view') && navigate('/not-found');
        }
    }, [permission, navigate]);

    const categoryAction = getCategories({
        body: {},
        options: { __module: "category", pagination: true },
      });

    useEffect(() => {
        window.scrollTo(0, 0);
        //  !checkFeaturePermission('category-view') && navigate('/not-found');
        dispatch(categoryAction)
    }, [dispatch]);

    const handleStatus = (status, id) => {
        if (!status) {
            dispatch(
                deactivateCategory({
                    body: {},
                    options: { id: id, __module: 'category', showToast: true },
                }))
        } else {
            dispatch(
                activateCategory({
                    body: {},
                    options: { id: id, __module: 'category', showToast: true },
                }))
        }
    }

    if (!permission || !categories) {
        return '';
    }

    return (
        <>
            <div className="col-lg-9 pt-4 pb-2 pb-sm-4">
                {/* Basic info*/}
                <section className="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
                    <div className="card-body">
                        <div className="d-flex align-items-center mt-sm-n1 pb-4 mb-0 mb-lg-1 mb-xl-3"><i className="ai-tag text-primary lead pe-1 me-2" />
                            <h2 className="h4 mb-0">Categories Information</h2>
                            {checkFeaturePermission('category-add') ?
                                <Link to='/system/category/create' className="btn btn-sm btn-secondary ms-auto">Add Category</Link>
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
                        fetchAction={categoryAction}
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
                                    <th>Trend</th>
                                    <th>Article</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                                </tbody><tbody>
                                    {categories && categories?.list?.map((data, index) => {
                                        return (
                                            <tr key={"tr-" + data._id}>
                                                <th scope="row">{++index}</th>
                                                <td>{data.name}</td>
                                                <td>{data.select}</td>
                                                <td>{data.publications.length}</td>
                                                <td>{
                                                    checkFeaturePermission('category-delete') ?
                                                        <div className="form-check form-switch">
                                                            <input type="checkbox" onChange={() => handleStatus(data.active ? false : true, data._id)} className="form-check-input" id="customSwitch1" checked={data.active ? true : false} />
                                                        </div> : ''
                                                }
                                                </td>
                                                <td>
                                                    {
                                                        checkFeaturePermission('category-update') ?
                                                            <Link className="btn btn-primary btn-sm btn-icon mb-2 me-2" to={"/system/category/" + data._id + "/edit"} data-bs-toggle="tooltip" aria-label="Edit">
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
                        fetchAction={categoryAction}
                        extraParams={{ __module: "category" }}
                        pagination={{
                            ...categories?.pagination,
                            total: categories?.list?.length,
                        }}
                        />
                    </div>
                </section>
            </div>
        </>
    );
};

export default Category;