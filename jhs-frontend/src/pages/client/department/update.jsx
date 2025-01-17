/* eslint-disable */
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate,useParams } from 'react-router-dom';

import UpdateButton from '../../../components/button/Button';
import { checkFeaturePermission } from 'helpers/globalHelpers';

// functions
import { updateDepartment, getDepartment } from '../../../store/admin/department/actions';

const Update = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const permission = useSelector((state) => state.profile.role);
    const department = useSelector((state) => state.departments.single);
    const { id } = useParams();

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm({ reValidateMode: 'onChange' });

    useEffect(()=>{
        window.scrollTo(0, 0);
        dispatch(
            getDepartment({
                body: {},
                options: { id:id, btnLoader: true, __module: 'department' },
            }));
    },[dispatch, id]);

    useEffect(() => {
        reset();
    }, [department, reset]);

    useEffect(() => {
        if (permission && permission.length) {
            !checkFeaturePermission('department-update') && navigate('/system/department');
        }
    }, [permission, navigate]);

    const updateHandle = (formData) => {
        dispatch(
            updateDepartment({
                body: { ...formData },
                options: { id:id, btnLoader: true, __module: 'department', showToast: true },
            }));
    }

    if (!permission || !department) {
        return '';
    }
    return (
        <>
            <div className="col-lg-9 pt-4 pb-2 pb-sm-4">
                <h1 className="h2 mb-4">Department</h1>
                {/* Companies list */}
                <section className="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
                    <div className="card-body">
                        <div className="d-flex align-items-center mt-sm-n1 pb-4 mb-0 mb-lg-1 mb-xl-3"><i className="ai-briefcase text-primary lead pe-1 me-2" />
                            <h2 className="h4 mb-0">Update Department</h2>
                        </div>
                        <form onSubmit={handleSubmit(updateHandle)}>
                            <div className="row g-3 g-sm-4 mt-0 mt-lg-2">
                                <div className="col-sm-12">
                                    <label className="form-label" htmlFor="fn">Department Name</label>
                                    <input className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        {...register('name', {
                                            required: 'Company name is required', value:department?.name
                                        })} type="text" id="fn" placeholder='Department Name...' />
                                    <div className="invalid-feedback">{errors.name?.message}</div>
                                </div>
                                <div className="col-sm-6">
                                    <label className="form-label" htmlFor="email">Email</label>
                                    <input className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        {...register('email', {
                                            required: "Email is required",value:department?.email

                                        })}
                                        type="text" id="email" placeholder='Email...' />
                                    <div className="invalid-feedback">{errors.email?.message}</div>
                                </div>
                                <div className="col-sm-6">
                                    <label className="form-label" htmlFor="phone">Phone</label>
                                    <input className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                        {...register('phone', {
                                            required: "Phone is required",value:department?.phone
                                        })}
                                        type="text" id="phone" placeholder='Phone...' />
                                    <div className="invalid-feedback">{errors.phone?.message}</div>
                                </div>
                                <div className="col-sm-6">
                                    <label className="form-label" htmlFor="country">Country <span className="text-muted">(optional)</span></label>
                                    <input className={`form-control ${errors.country ? 'is-invalid' : ''}`}
                                        {...register('country', {value:department?.country})}
                                        type="text" id="country" placeholder='Country...' />
                                    <div className="invalid-feedback">{errors.country?.message}</div>
                                </div>
                                <div className="col-sm-6">
                                    <label className="form-label" htmlFor="city">City <span className="text-muted">(optional)</span></label>
                                    <input className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                                        {...register('city', {value:department?.city})}
                                        type="text" id="city" placeholder='City...' />
                                    <div className="invalid-feedback">{errors.city?.message}</div>
                                </div>
                                <div className="col-sm-12">
                                    <label className="form-label" htmlFor="address">Address <span className="text-muted">(optional)</span></label>
                                    <input className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                        {...register('address', {value:department?.address})}
                                        type="text" id="address" placeholder='Address...' />
                                    <div className="invalid-feedback">{errors.address?.message}</div>
                                </div>
                                <div className="col-12 d-flex justify-content-end pt-3">
                                    <Link className="btn btn-secondary" to='/system/department'>Cancel</Link>
                                    <UpdateButton className='btn btn-primary ms-3' title="Update Department" type='submit' />
                                </div>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Update;