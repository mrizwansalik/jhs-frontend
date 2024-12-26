/* eslint-disable */
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';

import { checkFeaturePermission } from 'helpers/globalHelpers';

// function
import { getAllInvoiceWithClient } from '../../../store/admin/invoice/actions';

const Invoice = () => {
    const dispatch = useDispatch();
    const invoice = useSelector((state) => state.invoice.list);
    const permission = useSelector((state)=>state.profile.role);

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({ reValidateMode: 'onChange' });

    useEffect(()=>{
        if(permission && permission.length){
            !checkFeaturePermission('invoice-view') && Navigate('/not-found');
        }
    },[permission]);
    
    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(
            getAllInvoiceWithClient({
                body: {},
                options: { __module: 'invoice' },
            }))
    }, []);

    if(!permission || !invoice){
        return '';
    } // end if

    return (
        <>
            <div className="col-lg-9 pt-4 pb-2 pb-sm-4">
                {/* Invoice list */}
                <section className="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
                    <div className="card-body">
                        <div className="d-flex align-items-center mt-sm-n1 pb-4 mb-0 mb-lg-1 mb-xl-3">
                            <i className="ai-tag text-primary lead pe-1 me-2" />
                            <h2 className="h4 mb-0">Invoice Information</h2>
                            {/* {checkFeaturePermission('invoice-add') ?
                                <Link className="btn btn-sm btn-secondary ms-auto" to="/system/invoice/create">
                                    Add Invoice
                                </Link>
                                : ''} */}
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <tbody><tr>
                                    <th>#</th>
                                    <th>Invoice Number</th>
                                    <th>Client</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                                </tbody>
                                <tbody>
                                    {invoice && invoice.map((data, index) => {
                                        return (
                                            <tr key={"tr-" + data._id}>
                                                <th scope="row">{++index}</th>
                                                <td>{data?.invoiceNumber}</td>
                                                <td>{data?.client?.full_name}</td>
                                                <td>{data?.grandTotal}</td>
                                                <td><span className="badge text-nav fs-xs border">{data?.status === -1 ? "Pending": (data?.status === 0 ? "Paid" : "Partially Paid") }</span></td>
                                                <td>
                                                    {
                                                        checkFeaturePermission('invoice-update') ?
                                                            <Link className="btn btn-primary btn-sm btn-icon mb-1 me-1" to={"/system/invoice/" + data._id + "/edit"} aria-label="Edit">
                                                                <i className="ai-edit fs-xs"></i>
                                                            </Link> : ''
                                                    }
                                                    {
                                                        checkFeaturePermission('invoice-view') ?
                                                        <Link className="btn btn-info btn-sm btn-icon mb-1 me-1" to={"/system/invoice/" + data._id + "/show"} aria-label="Edit">
                                                            <i className="ai-file-text fs-xs"></i>
                                                        </Link> : ''
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>

        </>
    );
};

export default Invoice;