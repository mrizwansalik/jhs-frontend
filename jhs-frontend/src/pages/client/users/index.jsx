
/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { checkFeaturePermission } from 'helpers/globalHelpers';
import Filter from 'components/Filter';
import Pagination from 'components/pagination/Pagination';

import { getUsers, deactivateUser, activateUser } from '../../../store/admin/user/actions';

const Users = () => {
    const childCompRef = useRef();
    const dispatch = useDispatch();
    const [isFilter, setIsFilter] = useState(false);
    const users = useSelector((state) => state.user);
    const permission = useSelector((state) => state.profile.role);
    const filter = useSelector(state => state.filters)

    const filterVisibility = () => {
        isFilter === false ? setIsFilter(true) : setIsFilter(false);
    };

    const handleStatus = (status, id) => {
        if (!status) {
            dispatch(
                deactivateUser({
                    body: {},
                    options: { id: id, __module: 'user', showToast: true },
                }))
        } else {
            dispatch(
                activateUser({
                    body: {},
                    options: { id: id, __module: 'user', showToast: true },
                }))
        }
    }

    const getUsersAction = getUsers({
        body: {},
        options: { __module: 'user', pagination: true },
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(getUsersAction);
    }, []);

    if (!users) {
        return '';
    }
    return (
        <>
            <div className="col-lg-9 pt-4 pb-2 pb-sm-4">
                {/* Users list */}
                <section className="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
                    <div className="card-body">
                        <div className="d-flex align-items-center mt-sm-n1 pb-4 mb-0 mb-lg-1 mb-xl-3">
                            <i className="ai-user text-primary lead pe-1 me-2" />
                            <h2 className="h4 mb-0">Users list</h2>
                            {checkFeaturePermission('user-add') ?
                                <Link className="btn btn-sm btn-secondary ms-auto" to="/system/users/add">
                                    Add User
                                </Link>
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
                            fetchAction={getUsersAction}
                        >
                            <div className="col-md-4 mb-2">
                                <label className="form-label" htmlFor="full_name">
                                    Name
                                </label>
                                <input
                                    onChange={(event) =>
                                        childCompRef.current.getAdditionalFilterData(
                                            "full_name",
                                            event
                                        )
                                    }
                                    className="form-control form-control-sm"
                                    type="text"
                                    id="full_name"
                                />
                            </div>
                            <div className="col-md-4 mb-2">
                                <label className="form-label" htmlFor="position">
                                    Position
                                </label>
                                <input
                                    onChange={(event) =>
                                        childCompRef.current.getAdditionalFilterData(
                                            "position",
                                            event
                                        )
                                    }
                                    className="form-control form-control-sm"
                                    type="text"
                                    id="position"
                                />
                            </div>
                            <div className="col-md-4 mb-2">
                                <label className="form-label" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    onChange={(event) =>
                                        childCompRef.current.getAdditionalFilterData(
                                            "email",
                                            event
                                        )
                                    }
                                    className="form-control form-control-sm"
                                    type="text"
                                    id="email"
                                />
                            </div>
                            <div className="col-md-4 mb-2">
                                <label className="form-label" htmlFor="role">
                                    Role
                                </label>
                                <input
                                    onChange={(event) =>
                                        childCompRef.current.getAdditionalFilterData(
                                            "role",
                                            event
                                        )
                                    }
                                    className="form-control form-control-sm"
                                    type="text"
                                    id="role"
                                />
                            </div>
                            <div className='col-md-4 mb-2'>
                                <label className=' form-label fs--2'>User Status</label>
                                <select
                                    value={filter?.active ? filter?.active : ''}
                                    onChange={(event) =>
                                        childCompRef.current.getAdditionalFilterData(
                                            "active",
                                            event
                                        )
                                    } className="form-select form-select-sm"
                                    id="active" size="1" name="organizerSingle" data-options='{"removeItemButton":true,"placeholder":true}'>
                                    <option value="">All</option>
                                    <option value="1">Active</option>
                                    <option value="0">Un-Active</option>
                                </select>
                            </div>
                            <div className='col-md-4 mb-2'>
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
                                    <option value="">None</option>
                                    <option value="full_name">Name - ASC</option>
                                    <option value="position">Position - ASC</option>
                                    <option value="role">Role - ASC</option>
                                    <option value="email">Email - ASC</option>
                                    <option value="createdAt">Created at - ASC</option>
                                    <option value="-full_name">Name - DESC</option>
                                    <option value="-position">Position - DESC</option>
                                    <option value="-role">Role - DESC</option>
                                    <option value="-email">Email - DESC</option>
                                    <option value="-createdAt">Created at - DESC</option>
                                </select>
                            </div>
                        </Filter>
                        <div className="accordion accordion-alt accordion-orders" id="orders">
                            {users && users?.list?.map((users, index) => {
                                return (
                                    <div className="accordion-item border-top border-bottom  mb-0" key={`users-list-${users?._id}`}>
                                        <div className="accordion-header">
                                            <a
                                                className="accordion-button d-flex fs-4 fw-normal text-decoration-none py-3 collapsed"
                                                href={"#orderOne" + index}
                                                data-bs-toggle="collapse"
                                                aria-expanded="false"
                                                aria-controls={"#orderOne" + index}
                                            >
                                                <div className="w-100 row">
                                                    <div className="col me-3 me-sm-4 m-2 d-md-flex align-items-center">

                                                        <img
                                                            className="rounded-circle bg-size-cover bg-position-center flex-shrink-0"
                                                            src={`${users?.file ? `${import.meta.env.VITE_REACT_APP_URL}/public/uploads/profile/${users?.file}` : '/assets/img/avatar/user.png'}`}
                                                            style={{
                                                            width: 48,
                                                            height: 48,
                                                            }}
                                                        />
                                                        <div className="pt-3 pt-sm-0 ps-sm-3">
                                                            <h3 className="h6 mb-1">
                                                                {users?.full_name ?? 'Unnamed User'}
                                                            </h3>
                                                            <div className="text-muted fw-medium d-flex flex-wrap flex-sm-nowrap align-iteems-center">
                                                                <div className="d-flex align-items-center me-3 fs-sm fw-medium text-capitalize">
                                                                    <span className="badge bg-faded-info text-info fs-xs">{users?.position}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col me-3 me-sm-4 m-2">
                                                        <div className="d-none d-sm-block fs-sm text-muted mb-2">Email</div>
                                                        <div className="fs-sm fw-medium text-dark text-lowercase">{users?.email}</div>
                                                    </div>
                                                    <div className="col me-3 me-sm-4 m-2">
                                                        <div className="d-none d-sm-block fs-sm text-muted mb-2">Role</div>
                                                        <div className="fs-sm fw-medium text-dark text-capitalize">{users?.role}</div>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                                        <div
                                            className="accordion-collapse collapse"
                                            id={"orderOne" + index}
                                            data-bs-parent="#orders"
                                        >
                                            <div className="accordion-body">
                                                <div className="table-responsive pt-1">
                                                    <table
                                                        className="table align-middle w-100"
                                                        style={{ minWidth: 450 }}
                                                    >
                                                        <tbody>
                                                            <tr>
                                                                <td className="border-0 py-1 px-0">
                                                                    <div className="d-flex align-items-center">
                                                                        <a
                                                                            className="d-inline-block flex-shrink-0 bg-secondary rounded-1 p-md-2 p-lg-3"
                                                                            href="#"
                                                                        >
                                                                            <img
                                                                                src={`${users?.file ? `${import.meta.env.VITE_REACT_APP_URL}/public/uploads/profile/${users?.file}` : '/assets/img/avatar/user.png'}`}
                                                                                width={110}
                                                                                alt="User icon"
                                                                            />
                                                                        </a>
                                                                        <div className="ps-3 ps-sm-4">
                                                                            <h4 className="h6 mb-2">
                                                                                <a href="#">{users?.first_name}</a>
                                                                            </h4>
                                                                            <div className="text-muted fs-sm me-3">
                                                                                Occupation:{" "}
                                                                                <span className="text-dark fw-medium">
                                                                                    {users?.occupation ?? '-'}
                                                                                </span>
                                                                            </div>
                                                                            <div className="text-muted fs-sm me-3">
                                                                                <div className='row'>
                                                                                    <div className='col-md-6'>Status:</div>
                                                                                    <div className='col-md-4'>
                                                                                        <div className="form-check form-switch">
                                                                                            <input type="checkbox" onChange={() => handleStatus(users.active ? false : true, users._id)} className="form-check-input" id="customSwitch1" checked={users.active ? true : false} />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="border-0 py-1 pe-0 ps-3 ps-sm-4">
                                                                    <div className="fs-sm text-muted mb-2">Published Articles</div>
                                                                    <div className="fs-sm fw-medium text-dark">-</div>
                                                                </td>
                                                                <td className="border-0 py-1 pe-0 ps-3 ps-sm-4">
                                                                    <div className="fs-sm text-muted mb-2">Reviewed Articles</div>
                                                                    <div className="fs-sm fw-medium text-dark">-</div>
                                                                </td>
                                                                <td className="border-0 text-end py-1 pe-0 ps-3 ps-sm-4">
                                                                    <div className="fs-sm text-muted mb-2">Rating</div>
                                                                    <div className="fs-sm fw-medium text-dark">-</div>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="bg-secondary rounded-1 p-4 my-2">
                                                    <div className="row">
                                                        <div className="col-sm-5 col-md-3 col-lg-4 mb-3 mb-md-0">
                                                            <div className="fs-sm fw-medium text-dark mb-1">Pending Payment:</div>
                                                            <div className="fs-sm">0</div>
                                                            <a className="btn btn-link py-1 px-0 mt-2" href="#">
                                                                <i className="ai-time me-2 ms-n1" />
                                                                Show Payment history
                                                            </a>
                                                        </div>
                                                        <div className="col-sm-7 col-md-5 mb-4 mb-md-0">
                                                            <div className="fs-sm fw-medium text-dark mb-1">
                                                                Language:
                                                            </div>
                                                            <div className="fs-sm">
                                                                {users?.language}
                                                            </div>
                                                        </div>
                                                        <div className="col-md-4 col-lg-3 text-md-end">
                                                            {checkFeaturePermission('user-update') ?
                                                                <Link
                                                                    className="btn btn-sm btn-outline-primary w-100 w-md-auto"
                                                                    to={"/system/users/" + users?._id + "/edit"}
                                                                >
                                                                    <i className="ai-user me-2 ms-n1" />
                                                                    Edit Detail
                                                                </Link>
                                                                : ""}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <Pagination
                            fetchAction={getUsersAction}
                            extraParams={{ __module: "user" }}
                            pagination={{
                                ...users?.pagination,
                                total: users?.list?.length,
                            }}
                        />
                    </div>
                </section>
            </div>
        </>
    );
};

export default Users;