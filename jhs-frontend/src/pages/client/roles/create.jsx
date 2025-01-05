/* eslint-disable */
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import AddRolesButton from '../../../components/button/Button';

// functions
import { createRole } from '../../../store/admin/roles/actions';
import { getPermissions } from '../../../store/admin/permissions/actions';
import { checkAdministration } from 'helpers/globalHelpers';

const Create = () => {
    const dispatch = useDispatch();
    const permissions = useSelector((state) => state.permissions.list);

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({ reValidateMode: 'onChange' });

    useEffect(() => {
        window.scrollTo(0, 0);
        !checkAdministration() && navigate('/system');
    }, []);

    useEffect(() => {
        dispatch(
            getPermissions({
                body: {},
                options: { btnLoader: true, __module: 'permission' },
            })
        );
    }, [dispatch]);

    const addRolesHandle = (formData) => {
        const updatedPermissions = Object.keys(formData).filter(k => formData[k] === true);
        const data = {
            name: formData.name,
            rolePermission: updatedPermissions
        }
        dispatch(
            createRole({
                body: { ...data },
                options: { btnLoader: true, __module: 'role', showToast: true },
            }));
    }

    return (
        <>
            <div className="col-lg-9 pt-4 pb-2 pb-sm-4">
                <h1 className="h2 mb-4">Create Roles</h1>
                {/* Basic info*/}
                <section className="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
                    <div className="card-body">
                        <form onSubmit={handleSubmit(addRolesHandle)} className="needs-validation" noValidate>
                            <div className="row">
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="validationCustom01" className="form-label">Name</label>
                                    <input className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        {...register('name', {
                                            required: 'Roles name required',
                                        })}
                                        type="text" id="validationCustom01" placeholder="Roles name..." />
                                    <div className="invalid-feedback">{errors.name?.message}</div>
                                </div>
                                <div className="col-md-12 mb-3">
                                    {permissions?.map((permission) => {
                                        return (
                                            <div key={permission?._id} className="row">
                                                <div className="h6 mb-2">{permission?.name}</div>
                                                <div className='pt-0 pb-3'>
                                                    {permission.feature.map((feature) => {
                                                        return (
                                                            <div key={permission?.slug + "-" + feature?.slug} className="form-check form-check-inline">
                                                                <input className="form-check-input" {...register(`${permission.slug}-${feature.slug}`, {  })} type="checkbox" />
                                                                <label className="form-check-label" htmlFor="ex-check-4">{feature?.name}</label>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="col-12 d-flex justify-content-end pt-3">
                                    <Link className="btn btn-secondary" to='/system/roles'>Cancel</Link>
                                    <AddRolesButton className='btn btn-primary ms-3' title="Add Roles" type='submit' />
                                </div>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Create;