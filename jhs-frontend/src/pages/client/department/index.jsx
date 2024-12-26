/* eslint-disable */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { checkFeaturePermission } from 'helpers/globalHelpers';

// functions
import { getDepartments, deactivateDepartment, activateDepartment } from '../../../store/admin/department/actions';

const Department = () => {

    const dispatch = useDispatch();
    const departments = useSelector((state) => state.departments.list);
    const permission = useSelector((state) => state.profile.role);
    const navigate = useNavigate();

    useEffect(() => {
        if (permission && permission.length) {
            !checkFeaturePermission('department-view') && navigate('/not-found');
        }
    }, [permission, navigate]);

    useEffect(() => {
        window.scrollTo(0, 0);
        //  !checkFeaturePermission('department-view') && navigate('/not-found');
        dispatch(
            getDepartments({
                body: {},
                options: { __module: 'department' },
            }))
    }, [dispatch]);

    const handleStatus = (status, id) => {
        if (!status) {
            dispatch(
                deactivateDepartment({
                    body: {},
                    options: { id: id, __module: 'department', showToast: true },
                }))
        } else {
            dispatch(
                activateDepartment({
                    body: {},
                    options: { id: id, __module: 'department', showToast: true },
                }))
        }
    }

    if (!permission || !departments) {
        return '';
    }

    return (
        <>
            <div className="col-lg-9 pt-4 pb-2 pb-sm-4">
                {/* Basic info*/}
                <section className="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
                    <div className="card-body">
                        <div className="d-flex align-items-center mt-sm-n1 pb-4 mb-0 mb-lg-1 mb-xl-3"><i className="ai-briefcase text-primary lead pe-1 me-2" />
                            <h2 className="h4 mb-0">Departments Information</h2>
                            {checkFeaturePermission('department-add') ?
                                <Link to='/system/department/create' className="btn btn-sm btn-secondary ms-auto">Add Department</Link>
                                : ''}

                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <tbody><tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                                </tbody><tbody>
                                    {departments && departments.map((data, index) => {
                                        return (
                                            <tr key={"tr-" + data._id}>
                                                <th scope="row">{++index}</th>
                                                <td>{data.name}</td>
                                                <td>{data.email}</td>
                                                <td>{data.phone}</td>
                                                <td>{
                                                    checkFeaturePermission('department-delete') ?
                                                        <div className="form-check form-switch">
                                                            <input type="checkbox" onChange={() => handleStatus(data.active ? false : true, data._id)} className="form-check-input" id="customSwitch1" checked={data.active ? true : false} />
                                                        </div> : ''
                                                }
                                                </td>
                                                <td>
                                                    {
                                                        checkFeaturePermission('department-update') ?
                                                            <Link className="btn btn-primary btn-sm btn-icon mb-2 me-2" to={"/system/department/" + data._id} data-bs-toggle="tooltip" aria-label="Edit">
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
                    </div>
                </section>
            </div>
        </>
    );
};

export default Department;