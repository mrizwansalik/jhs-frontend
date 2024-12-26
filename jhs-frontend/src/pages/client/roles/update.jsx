/* eslint-disable */
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import EditRoleButton from '../../../components/button/Button';

// functions
import { updateRole } from '../../../store/admin/roles/actions';
import { getPermissions } from '../../../store/admin/permissions/actions';
import { getRole } from '../../../store/admin/roles/actions';

const Update = () => {
    let { roleId } = useParams();
    const dispatch = useDispatch();
    const permissions = useSelector((state) => state.permissions.list);
    const roleInfo = useSelector((state) => state.roles.single);

    const {
        register,
        handleSubmit,
        reset,
    } = useForm({ reValidateMode: 'onChange', defaultValues: '' });

    useEffect(() => {
        reset();
    }, [roleInfo, reset]);

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(
            getPermissions({
                body: {},
                options: { btnLoader: true, __module: 'permission' },
            })
        );
        dispatch(
            getRole({
                body: {},
                options: { id: roleId, btnLoader: true, __module: 'role' },
            })
        );
    }, [dispatch, roleId]);

    const updateRoleHandle = (formData) => {
        const updatedPermissions = Object.keys(formData).filter(k => formData[k] === true);
        const data = {
            rolePermission: updatedPermissions
        }
        dispatch(
            updateRole({
                body: { ...data },
                options: { id: roleId, btnLoader: true, __module: 'role', showToast: true },
            }));
    }

    if (!permissions || !roleInfo) {
        return null;
    }

    return (
        <>
            <div className="col-lg-9 pt-4 pb-2 pb-sm-4">
                <h1 className="h2 mb-4">Edit Role</h1>
                {/* Basic info*/}
                <section className="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
                    <div className="card-body">
                        <h2 className="h5 mb-n2 pb-4 ">Edit Permission information for {roleInfo?.name} role</h2>
                        <form onSubmit={handleSubmit(updateRoleHandle)} className="needs-validation" noValidate>
                            {permissions.map((permission) => {
                                return (
                                    <div key={permission?._id} className="row">
                                        <div className="h6 mb-2">{permission?.name}</div>
                                        <div className='pt-0 pb-3'>
                                            {permission.feature.map((feature) => {
                                                //  const selected= roleInfo.rolePermission.includes(`${permission.slug}-${feature.slug}`);
                                                return (
                                                    <div key={permission?.slug + "-" + feature?.slug} className="form-check form-check-inline">
                                                        <input className="form-check-input" {...register(`${permission.slug}-${feature.slug}`, { value: roleInfo.rolePermission.includes(`${permission.slug}-${feature.slug}`) })} type="checkbox" />
                                                        <label className="form-check-label" htmlFor="ex-check-4">{feature?.name}</label>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                            <div className="col-12 d-flex justify-content-end pt-3">
                                <Link className="btn btn-secondary" to='/system/roles'>Cancel</Link>
                                <EditRoleButton className='btn btn-primary ms-3' title="Save Role" type='submit' />
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Update;