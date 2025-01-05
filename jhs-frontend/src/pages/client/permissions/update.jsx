/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { TagsInput } from "react-tag-input-component";
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import UpdateButton from '../../../components/button/Button';

import { updatePermission, getPermission } from '../../../store/admin/permissions/actions';
import { checkAdministration } from 'helpers/globalHelpers';

const Update = () => {
    const [selected, setSelected] = useState('');
    const permission = useSelector((state) => state.permissions.single);
    const dispatch = useDispatch();

    let { permissionId } = useParams();

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm({ reValidateMode: 'onChange' });

    useEffect(() => {
        reset();
    }, [permission, reset]);

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(getPermission({
            body: {},
            options: { id: permissionId, btnLoader: true, __module: 'permission', },
        }));
    }, [permissionId, dispatch]);

    useEffect(() => {
        !checkAdministration() && navigate('/system');
        setSelected(permission?.feature?.map(({ name }) => name));
    }, [permission]);

    const addPermissionHandle = (formData) => {
        const data = {
            name: formData.name,
            feature: selected,
        }
        dispatch(
            updatePermission({
                body: { ...data },
                options: { id:permissionId, btnLoader: true, __module: 'permission', showToast: true },
            }));
    }

    if (!permission) {
        return '';
    }
    
    return (
        <>
            <div className="col-lg-9 pt-4 pb-2 pb-sm-4">
                <h1 className="h2 mb-4">Edit Permission</h1>
                {/* Basic info*/}
                <section className="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
                    <div className="card-body">
                        <form onSubmit={handleSubmit(addPermissionHandle)} className="needs-validation" noValidate>
                            <div className="row">
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="validationCustom01" className="form-label">Name</label>
                                    <input className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        {...register('name', {
                                            required: 'Permission name required', value: permission?.name
                                        })}
                                        type="text" id="validationCustom01" placeholder="Permission name..." />
                                    <div className="invalid-feedback">{errors.name?.message}</div>
                                </div>
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="validationCustomUsername" className="form-label">Permissions</label>
                                    <TagsInput
                                        value={selected}
                                        onChange={setSelected}
                                        name="feature"
                                        placeHolder="Type feature and hits enter..."
                                    />
                                    <div className="invalid-feedback">Please choose a feature.</div>
                                    <div className="valid-feedback">Looks good!</div>
                                </div>
                                <div className="col-12 d-flex justify-content-end pt-3">
                                    <Link className="btn btn-secondary" to='/system/permissions'>Cancel</Link>
                                    <UpdateButton className='btn btn-primary ms-3' title="Save Permission" type='submit' />
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