
/* eslint-disable */
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import UpdateButton from '../../../components/button/Button';
import { checkFeaturePermission } from 'helpers/globalHelpers';

// function
import { getInvoice, updateInvoice, getAllInvoice } from '../../../store/admin/invoice/actions';

const UpdateInvoice = () => {
    const dispatch = useDispatch();
    let { invoiceId } = useParams();
    const invoiceInfo = useSelector((state) => state.invoice.single);
    const permission = useSelector((state) => state.profile.role);

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm({ reValidateMode: 'onChange' });

    useEffect(() => {
        if (permission && permission.length) {
            !checkFeaturePermission('invoice-update') && navigate('/not-found');
        }
    }, [permission]);

    useEffect(() => {
        reset();
    }, [invoiceInfo]);

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(getInvoice({
            body: {},
            options: { id: invoiceId, btnLoader: true, __module: 'invoice', },
        }));
        dispatch(
            getAllInvoice({
                body: {},
                options: { __module: 'invoice' },
            }))
    }, []);

    const updateInvoiceHandle = (formData) => {
        dispatch(
            updateInvoice({
                body: { ...formData },
                options: { id: invoiceId, btnLoader: true, __module: 'invoice', showToast: true },
            }));
    }
    if (!permission || !invoiceInfo) {
        return '';
    }


    return (
        <div className="col-lg-9 pt-4 pb-2 pb-sm-4">
            <h1 className="h2 mb-4">Article Status</h1>
            <section className="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
                {checkFeaturePermission('articlestatus-update') ?
                    <div className="card-body">
                        <div className="d-flex align-items-center mt-sm-n1 pb-4 mb-0 mb-lg-1 mb-xl-3"><i className="ai-tag text-primary lead pe-1 me-2" />
                            <h2 className="h4 mb-0">Edit Invoice</h2>
                        </div>
                        <form onSubmit={handleSubmit(updateInvoiceHandle)}>
                            <div className="row g-3 g-sm-4 mt-0 mt-lg-2">

                                <div className="col-sm-12">
                                    <label className="form-label" htmlFor="nt">Nick Title</label>
                                    <input className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        {...register('nickTitle', {
                                            required: 'Nick Title is required',
                                            value: invoiceInfo?.nickTitle
                                        })} type="text" id="nt" />
                                    <div className="invalid-feedback">{errors.name?.message}</div>
                                </div>
                                <div className="col-sm-12">
                                    <label className="form-label" htmlFor="title">Display Title</label>
                                    <input className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        {...register('title', {
                                            required: 'Title is required',
                                            value: invoiceInfo?.title
                                        })} type="text" id="title" />
                                    <div className="invalid-feedback">{errors.name?.message}</div>
                                </div>
                                <div className="col-sm-12">
                                    <label className="form-label" htmlFor="message">Description</label>
                                    <input className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                                        {...register('description', {
                                            required: 'Description is required',
                                            value: invoiceInfo?.description
                                        })} type="text" id="description" />
                                    <div className="invalid-feedback">{errors.message?.message}</div>
                                </div>
                                <div className="col-sm-12">
                                    <label className="form-label" htmlFor="price">Price</label>
                                    <input className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                                        {...register('price', {
                                            required: 'Price is required',
                                            value: invoiceInfo?.price
                                        })} type="text" id="price" />
                                    <div className="invalid-feedback">{errors.message?.message}</div>
                                </div>
                                <div className="col-12 d-flex justify-content-end pt-3">
                                    <Link className="btn btn-secondary" to='/system/invoice'>Cancel</Link>
                                    <UpdateButton className='btn btn-primary ms-3' title="Save Invoice" type='submit' />
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

export default UpdateInvoice;