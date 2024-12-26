
/* eslint-disable */
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import UpdateButton from '../../../components/button/Button';
import { checkFeaturePermission } from 'helpers/globalHelpers';

import { addNewUser } from '../../../store/admin/user/actions';
import { getPublicDepartments } from '../../../store/admin/department/actions';

const AddUserPage = () => {
    const dispatch = useDispatch();
    const departments = useSelector((state) => state.departments.list);
    const user = JSON.parse(localStorage.getItem('auth'));
    const permission = useSelector((state) => state.profile.role);
    const navigate = useNavigate();

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({ reValidateMode: 'onChange' });

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(
            getPublicDepartments({
                body: {}, options: { __module: 'department' },
            }));
    }, []);

    useEffect(() => {
        if (permission && permission.length) {
            !checkFeaturePermission('user-add') && navigate('/not-found');
        }
    }, [permission]);

    const addUserHandle = (formData) => {
        dispatch(
            addNewUser({
                body: { ...formData },
                options: { id: user.user.id, btnLoader: true, __module: 'user', showToast: true },
            }));
    }
    
    if (!departments || !permission) {
        return '';
    }

    return (
        <div className="col-lg-9 pt-4 pb-2 pb-sm-4">
            {/* Users list */}
            <section className="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">


                <div className="card-body">
                    <div className="d-flex align-items-center mt-sm-n1 pb-4 mb-0 mb-lg-1 mb-xl-3"><i className="ai-user text-primary lead pe-1 me-2" />
                        <h2 className="h4 mb-0">Add User</h2>
                    </div>
                    <form onSubmit={handleSubmit(addUserHandle)}>
                        <div className="row g-3 g-sm-4 mt-0 mt-lg-2">
                            <div className="col-sm-4">
                                <label className="form-label" htmlFor="fn">First name</label>
                                <input className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                                    {...register('first_name', {
                                        required: 'First name is required',
                                    })} type="text" id="fn" />
                                <div className="invalid-feedback">{errors.first_name?.message}</div>
                            </div>
                            <div className="col-sm-4">
                                <label className="form-label" htmlFor="mn">Middle name</label>
                                <input className={`form-control ${errors.middle_name ? 'is-invalid' : ''}`}
                                    {...register('middle_name', {})} type="text" id="mn" />
                                <div className="invalid-feedback">{errors.middle_name?.message}</div>
                            </div>
                            <div className="col-sm-4">
                                <label className="form-label" htmlFor="ln">Last name</label>
                                <input className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                                    {...register('last_name', {
                                        required: 'Last name is required',
                                    })} type="text" id="ln" />
                                <div className="invalid-feedback">{errors.last_name?.message}</div>
                            </div>
                            <div className="col-sm-6">
                                <label className="form-label" htmlFor="email">Email</label>
                                <input className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    {...register('email', {
                                        required: "Email is required"
                                    })}
                                    type="text" id="email" />
                                <div className="invalid-feedback">{errors.email?.message}</div>
                            </div>
                            <div className="col-sm-6">
                                <label className="form-label" htmlFor="phone">Phone <span className="text-muted">(optional)</span></label>
                                <input className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                    {...register('phone', {})}
                                    type="text" id="phone" />
                                <div className="invalid-feedback">{errors.phone?.message}</div>
                            </div>
                            <div className="col-sm-6">
                                <label className="form-label" htmlFor="occupation">Occupation <span className="text-muted">(optional)</span></label>
                                <input className={`form-control ${errors.occupation ? 'is-invalid' : ''}`}
                                    {...register('occupation', {})}
                                    type="text" id="occupation" />
                                <div className="invalid-feedback">{errors.occupation?.message}</div>
                            </div>
                            <div className="col-sm-6">
                                <label className="form-label" htmlFor="department">Department <span className="text-muted">(optional)</span></label>
                                <select className="form-select" list="datalist-options" id="datalist-input" {...register('department', { required: "Department Required" })}>
                                    {departments?.map((department, index) => {
                                        return (
                                            <option value={department?._id} key={`department_${department?._id}`}>{department.name}</option>
                                        )
                                    })
                                    }

                                </select>

                                {/* <input className={`form-control ${errors.department ? 'is-invalid' : ''}`}
                                        {...register('department', {})}
                                        type="text" id="department" /> */}
                                <div className="invalid-feedback">{errors.department?.message}</div>
                            </div>
                            <div className="col-sm-12">
                                <label className="form-label" htmlFor="institute">Institute <span className="text-muted">(optional)</span></label>
                                <input className={`form-control ${errors.institute ? 'is-invalid' : ''}`}
                                    {...register('institute', {})}
                                    type="text" id="institute" />
                                <div className="invalid-feedback">{errors.institute?.message}</div>
                            </div>
                            <div className="col-12 d-sm-flex align-items-center pt-sm-2 pt-md-3">
                                <div className="form-label text-muted mb-2 mb-sm-0 me-sm-4">Gender:</div>
                                <div className="form-check form-check-inline mb-0">
                                    <input className="form-check-input"  {...register("gender", { required: "gender Required" })} type="radio" value="Male" name="gender" id="male" />
                                    <label className="form-check-label" htmlFor="male">Male</label>
                                </div>
                                <div className="form-check form-check-inline mb-0">
                                    <input className="form-check-input" {...register("gender", { required: "gender Required" })} value="Female" type="radio" name="gender" id="female" />
                                    <label className="form-check-label" htmlFor="female">Female</label>
                                </div>
                            </div>
                            <div className="col-12 d-flex justify-content-end pt-3">
                                <Link className="btn btn-secondary" to='/system/users'>Cancel</Link>
                                <UpdateButton className='btn btn-primary ms-3' title="Add User" type='submit' />
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default AddUserPage;