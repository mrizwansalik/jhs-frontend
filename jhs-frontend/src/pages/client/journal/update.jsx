
/* eslint-disable */
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import UpdateButton from '../../../components/button/Button';
import { checkFeaturePermission } from 'helpers/globalHelpers';

// functions
import { getPublicUser } from '../../../store/admin/user/actions';
import { getJournalWithManager, updateJournal } from '../../../store/admin/journal/actions';

const Update = () => {
    const dispatch = useDispatch();
    const journalInfo = useSelector((state) => state.journals.single);
    const users = useSelector((state) => state.user.list);
    const permission = useSelector((state) => state.profile.role);

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
    }, [dispatch]);

    useEffect(() => {
        reset();
    }, [journalInfo, reset]);

    useEffect(() => {
        if (permission && permission.length) {
            !checkFeaturePermission('journal-update') && navigate('/system/journal');
        }
    }, [permission]);

    useEffect(() => {
        dispatch(getJournalWithManager({
            body: {},
            options: { btnLoader: true, __module: 'journal', },
        }));
    }, [dispatch]);

    const updateJournalHandle = (formData) => {
        dispatch(
            updateJournal({
                body: { ...formData },
                options: { btnLoader: true, __module: 'journal', showToast: true },
            }));
    }

    if (!permission ) {
        return '';
    }

    return (
        <div className="col-lg-9 pt-4 pb-2 pb-sm-4">
            {/* Journals list */}
            <section className="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
                {checkFeaturePermission('journal-update') ?
                    <div className="card-body">
                        <div className="d-flex align-items-center mt-sm-n1 pb-4 mb-0 mb-lg-1 mb-xl-3"><i className="ai-open-book text-primary lead pe-1 me-2" />
                            <h2 className="h4 mb-0">Edit Journal</h2>
                        </div>
                        <form onSubmit={handleSubmit(updateJournalHandle)}>
                            <div className="row g-3 g-sm-4 mt-0 mt-lg-2">
                                <div className="col-sm-12">
                                    <label className="form-label" htmlFor="fn">Journal Name</label>
                                    <input className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        {...register('name', {
                                            required: 'Journal name is required',
                                            value: journalInfo?.name
                                        })} type="text" id="fn" />
                                    <div className="invalid-feedback">{errors.name?.message}</div>
                                </div>
                                <div className="col-sm-6">
                                    <label className="form-label" htmlFor="fn">Journal Short Name</label>
                                    <input className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        {...register('shortName', {
                                            required: 'Journal short name is required',
                                            value: journalInfo?.shortName
                                        })} type="text" id="shortName" />
                                    <div className="invalid-feedback">{errors.shortName?.message}</div>
                                </div>
                                <div className="col-sm-6">
                                    <label className="form-label" htmlFor="type">Journal Type</label>
                                    <input className={`form-control ${errors.type ? 'is-invalid' : ''}`}
                                        {...register('type', {
                                            required: "Type is required",
                                            value: journalInfo?.type
                                        })} type="text" id="type" />
                                    <div className="invalid-feedback">{errors.type?.message}</div>
                                </div>
                                <div className="col-sm-6">
                                    <label className="form-label" htmlFor="eISSN">eISSN</label>
                                    <input className={`form-control ${errors.eISSN ? 'is-invalid' : ''}`}
                                        {...register('eISSN', {
                                            required: "eISSN is required",
                                            value: journalInfo?.eISSN
                                        })}
                                        type="text" id="eISSN" />
                                    <div className="invalid-feedback">{errors.eISSN?.message}</div>
                                </div>
                                <div className="col-sm-6">
                                    <label className="form-label" htmlFor="pISSN">pISSN</label>
                                    <input className={`form-control ${errors.pISSN ? 'is-invalid' : ''}`}
                                        {...register('pISSN', {
                                            required: "pISSN is required",
                                            value: journalInfo?.pISSN
                                        })}
                                        type="text" id="pISSN" />
                                    <div className="invalid-feedback">{errors.pISSN?.message}</div>
                                </div>
                                <div className="col-sm-6">
                                    <label className="form-label" htmlFor="doiPrefix">DOI Prefix</label>
                                    <input className={`form-control ${errors.doiPrefix ? 'is-invalid' : ''}`}
                                        {...register('doiPrefix', {
                                            required: "DOI Prefix is required",
                                            value: journalInfo?.doiPrefix
                                        })}
                                        type="text" id="doiPrefix" />
                                    <div className="invalid-feedback">{errors.doiPrefix?.message}</div>
                                </div>
                                <div className="col-sm-6">
                                    <label className="form-label" htmlFor="_manageBy">Manage By</label>
                                    <select className="form-select" list="datalist-options" id="datalist-input" {...register('_manageBy', { required: "Manage by required", value: journalInfo?._manageBy?._id })}>
                                        {
                                            users?.map((user, index) => {
                                                return (
                                                    <option value={user?._id} key={`_manageBy_${user?._id}`}>{user.email}</option>
                                                )
                                            })
                                        }

                                    </select>
                                    <div className="invalid-feedback">{errors._manageBy?.message}</div>
                                </div>
                                <div className="col-12 d-flex justify-content-end pt-3">
                                    <Link className="btn btn-secondary" to='/system/journal'>Cancel</Link>
                                    <UpdateButton className='btn btn-primary ms-3' title="Save Journal" type='submit' />
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