
/* eslint-disable */
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import UpdateButton from '../../../components/button/Button';
import { checkFeaturePermission } from 'helpers/globalHelpers';
import { getPublicUser } from '../../../store/admin/user/actions';

// functions
import { getCompanyWithOwner, updateCompany } from '../../../store/admin/company/actions';

const Update = () => {
    const dispatch = useDispatch();
    const companyInfo = useSelector((state) => state.companies.single);

    const permission = useSelector((state) => state.profile.role);
    const users = useSelector((state) => state.user.list);
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm({ reValidateMode: 'onChange' });

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(
            getPublicUser({
                body: {}, options: { __module: 'user' },
            }));
    }, []);

    useEffect(() => {
        reset();
    }, [companyInfo]);

    useEffect(() => {
        if (permission && permission.length) {
            !checkFeaturePermission('company-view') && navigate('/system/category');
        }
    }, [permission]);

    useEffect(() => {
        dispatch(getCompanyWithOwner({
            body: {},
            options: { btnLoader: true, __module: 'company', },
        }));
    }, []);

    if (!permission) {
        return '';
    }
    const updateCompanyHandle = (formData) => {
        dispatch(
            updateCompany({
                body: { ...formData },
                options: { btnLoader: true, __module: 'company', showToast: true },
            }));
    }

    return (
        <div className="col-lg-9 pt-4 pb-2 pb-sm-4">
            {/* Companies list */}
            <section className="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
                {checkFeaturePermission('company-update') ?
                    <div className="card-body">
                        <div className="d-flex align-items-center mt-sm-n1 pb-4 mb-0 mb-lg-1 mb-xl-3"><i className="ai-briefcase text-primary lead pe-1 me-2" />
                            <h2 className="h4 mb-0">Edit Company Information</h2>
                        </div>
                        <form onSubmit={handleSubmit(updateCompanyHandle)}>
                            <div className="row g-3 g-sm-4 mt-0 mt-lg-2">
                                <div className="col-sm-12">
                                    <label className="form-label" htmlFor="fn">Company Name</label>
                                    <input className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        {...register('name', {
                                            required: 'Company name is required',
                                            value: companyInfo?.name
                                        })} type="text" id="fn" />
                                    <div className="invalid-feedback">{errors.name?.message}</div>
                                </div>
                                <div className="col-sm-6">
                                    <label className="form-label" htmlFor="email">Email</label>
                                    <input className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        {...register('email', {
                                            required: "Email is required",
                                            value: companyInfo?.email
                                        })}
                                        type="text" id="email" />
                                    <div className="invalid-feedback">{errors.email?.message}</div>
                                </div>
                                <div className="col-sm-6">
                                    <label className="form-label" htmlFor="phone">Phone</label>
                                    <input className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                        {...register('phone', {
                                            required: "Phone is required",
                                            value: companyInfo?.phone
                                        })}
                                        type="text" id="phone" />
                                    <div className="invalid-feedback">{errors.phone?.message}</div>
                                </div>
                                <div className="col-sm-6">
                                    <label className="form-label" htmlFor="country">Country <span className="text-muted">(optional)</span></label>
                                    <input className={`form-control ${errors.country ? 'is-invalid' : ''}`}
                                        {...register('country', {
                                            value: companyInfo?.country
                                        })}
                                        type="text" id="country" />
                                    <div className="invalid-feedback">{errors.country?.message}</div>
                                </div>
                                <div className="col-sm-6">
                                    <label className="form-label" htmlFor="city">City <span className="text-muted">(optional)</span></label>
                                    <input className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                                        {...register('city', {
                                            value: companyInfo?.city
                                        })}
                                        type="text" id="city" />
                                    <div className="invalid-feedback">{errors.city?.message}</div>
                                </div>
                                <div className="col-sm-12">
                                    <label className="form-label" htmlFor="address">Address <span className="text-muted">(optional)</span></label>
                                    <input className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                        {...register('address', {
                                            value: companyInfo?.address
                                        })}
                                        type="text" id="address" />
                                    <div className="invalid-feedback">{errors.address?.message}</div>
                                </div>
                                <div className="col-sm-12">
                                    <label className="form-label" htmlFor="_owner">Owner</label>
                                    <select className="form-select" list="datalist-options" id="datalist-input" {...register('_owner', { required: "Owner information by required", value: companyInfo?._owner?._id })}>
                                        {
                                            users?.map((user, index) => {
                                                return (
                                                    <option value={user?._id} key={`_owner_${user?._id}`}>{user.email}</option>
                                                )
                                            })
                                        }
                                    </select>
                                    <div className="invalid-feedback">{errors._owner?.message}</div>
                                </div>
                                <div className="col-12 d-flex justify-content-end pt-3">
                                    <Link className="btn btn-secondary" to='/system/company'>Cancel</Link>
                                    <UpdateButton className='btn btn-primary ms-3' title="Save Company" type='submit' />
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

export default Update;