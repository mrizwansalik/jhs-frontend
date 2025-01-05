
/* eslint-disable */
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import UpdateButton from '../../../components/button/Button';
import { checkFeaturePermission } from 'helpers/globalHelpers';

import { getUser, updateUser } from '../../../store/admin/user/actions';
import { getPublicDepartments } from '../../../store/admin/department/actions';


const EditUserPage = () => {
    const dispatch = useDispatch();
    let { userId } = useParams();
    const userInfo = useSelector((state) => state.user.single);
    const departments = useSelector((state) => state.departments.list);
    const permission = useSelector((state) => state.profile.role);

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm({ reValidateMode: 'onChange' });

    useEffect(() => {
        reset();
    }, [userInfo]);

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(getUser({ body: {}, options: { id: userId, btnLoader: true, __module: 'user', } }));
        dispatch(getPublicDepartments({ body: {}, options: { __module: 'department' } }));
    }, []);
    
    useEffect(() => {
        if (permission && permission.length) {
            !checkFeaturePermission('user-update') && navigate('/system/users');
        }
    }, [permission]);

    const updateUserHandle = (formData) => {
        dispatch(
            updateUser({
                body: { ...formData },
                options: { id: userId, btnLoader: true, __module: 'user', showToast: true },
            }));
    }

    return (
        <div className="col-lg-9 pt-4 pb-2 pb-sm-4">
            {/* Users list */}
            <section className="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">


                {checkFeaturePermission('user-update') ?

                    <div className="card-body">
                        <div className="d-flex align-items-center mt-sm-n1 pb-4 mb-0 mb-lg-1 mb-xl-3"><i className="ai-user text-primary lead pe-1 me-2" />
                            <h2 className="h4 mb-0">Edit User</h2>
                        </div>
                        <form onSubmit={handleSubmit(updateUserHandle)}>
                            <div className="row g-3 g-sm-4 mt-0 mt-lg-2">
                                <div className="col-sm-4">
                                    <label className="form-label" htmlFor="fn">First name</label>
                                    <input className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                                        {...register('first_name', {
                                            required: 'First name is required',
                                            value: userInfo?.first_name
                                        })} type="text" id="fn" />
                                    <div className="invalid-feedback">{errors.first_name?.message}</div>
                                </div>
                                <div className="col-sm-4">
                                    <label className="form-label" htmlFor="mn">Middle name</label>
                                    <input className={`form-control ${errors.middle_name ? 'is-invalid' : ''}`}
                                        {...register('middle_name', {
                                            value: userInfo?.middle_name
                                        })} type="text" id="mn" />
                                    <div className="invalid-feedback">{errors.middle_name?.message}</div>
                                </div>
                                <div className="col-sm-4">
                                    <label className="form-label" htmlFor="ln">Last name</label>
                                    <input className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                                        {...register('last_name', {
                                            required: 'Last name is required',
                                            value: userInfo?.last_name

                                        })} type="text" id="ln" />
                                    <div className="invalid-feedback">{errors.last_name?.message}</div>
                                </div>
                                <div className="col-sm-6">
                                    <label className="form-label" htmlFor="email">Email</label>
                                    <input className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        {...register('email', {
                                            required: "Email is required",
                                            value: userInfo?.email

                                        })}
                                        type="text" id="email" />
                                    <div className="invalid-feedback">{errors.email?.message}</div>
                                </div>
                                <div className="col-sm-6">
                                    <label className="form-label" htmlFor="phone">Phone <span className="text-muted">(optional)</span></label>
                                    <input className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                        {...register('phone', {
                                            value: userInfo?.phone
                                        })}
                                        type="text" id="phone" />
                                    <div className="invalid-feedback">{errors.phone?.message}</div>
                                </div>
                                <div className="col-sm-6">
                                    <label className="form-label" htmlFor="occupation">Occupation <span className="text-muted">(optional)</span></label>
                                    <input className={`form-control ${errors.occupation ? 'is-invalid' : ''}`}
                                        {...register('occupation', {
                                            value: userInfo?.occupation
                                        })}
                                        type="text" id="occupation" />
                                    <div className="invalid-feedback">{errors.occupation?.message}</div>
                                </div>
                                <div className="col-sm-6">
                                    <label className="form-label" htmlFor="department">Department <span className="text-muted">(optional)</span></label>
                                    <select className="form-select" list="datalist-options" id="datalist-input"  {...register('department', { required: "Department Requird", value: userInfo?.department })}>
                                        {departments?.map((department, index) => {
                                            return (
                                                <option value={department?._id} key={`department_${department?._id}`}>{department.name}</option>
                                            )
                                        })
                                        }
                                    </select>
                                    <div className="invalid-feedback">{errors.department?.message}</div>
                                </div>
                                <div className="col-sm-12">
                                    <label className="form-label" htmlFor="institute">Institute <span className="text-muted">(optional)</span></label>
                                    <input className={`form-control ${errors.institute ? 'is-invalid' : ''}`}
                                        {...register('institute', {
                                            value: userInfo?.institute
                                        })}
                                        type="text" id="institute" />
                                    <div className="invalid-feedback">{errors.institute?.message}</div>
                                </div>
                                <div className="col-12 d-flex justify-content-end pt-3">
                                    <Link className="btn btn-secondary" to='/system/users'>Cancel</Link>
                                    <UpdateButton className='btn btn-primary ms-3' title="Save User" type='submit' />
                                </div>
                            </div>
                        </form>
                    </div>
                    :
                    <>
                        Permission error
                    </>
                }
            </section>
        </div>
    );
};

export default EditUserPage;