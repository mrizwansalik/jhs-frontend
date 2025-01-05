/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { TagsInput } from "react-tag-input-component";
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import AddPermissionButton from '../../../components/button/Button';
import { Link } from 'react-router-dom';

// functions
import { createPermission } from '../../../store/admin/permissions/actions';
import { checkAdministration } from 'helpers/globalHelpers';

const Create = () => {
    const [selected, setSelected] = useState('');
    const dispatch = useDispatch();
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({ reValidateMode: 'onChange' });

    useEffect(() => {
        window.scrollTo(0, 0);
        !checkAdministration() && navigate('/system');
    }, []);

    const addPermissionHandle = (formData) => {
        const data = {
            name: formData.name,
            feature: selected,
        }
        dispatch(
            createPermission({
                body: { ...data },
                options: { btnLoader: true, __module: 'permission', showToast: true },
            }));
    }

    return (
        <>
            <div className="col-lg-9 pt-4 pb-2 pb-sm-4">
                <h1 className="h2 mb-4">Create Permission</h1>
                {/* Basic info*/}
                <section className="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
                    <div className="card-body">
                        <form onSubmit={handleSubmit(addPermissionHandle)} className="needs-validation" noValidate>
                            <div className="row">
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="validationCustom01" className="form-label">Name</label>
                                    <input className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        {...register('name', {
                                            required: 'Permission name required',
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
                                        placeHolder="Type permission and hits enter..."
                                    />
                                    <div className="invalid-feedback">Please choose a permission.</div>
                                    <div className="valid-feedback">Looks good!</div>
                                </div>
                                <div className="col-12 d-flex justify-content-end pt-3">
                                    <Link className="btn btn-secondary" to='/system/permissions'>Cancel</Link>
                                    <AddPermissionButton className='btn btn-primary ms-3' title="Add Permission" type='submit' />
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