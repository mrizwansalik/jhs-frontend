
/* eslint-disable */
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import html2pdf from 'html2pdf.js/dist/html2pdf.min';

import { checkFeaturePermission } from 'helpers/globalHelpers';

// functions
import { getInvoice, getAllInvoice } from '../../../store/admin/invoice/actions';

const ShowInvoice = () => {
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
            !checkFeaturePermission('invoice-Show');
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

    if (!permission || !invoiceInfo) {
        return '';
    }

    const pdfJSX = () => {
        return (
          <>
            <h1>JSX to PDF Convert Example</h1>
            <h2>Hello React</h2> 
          </>
        )
      }
    
      const printHandler = () => {
        const printElement = pdfJSX();
        html2pdf().from(printElement).save();
      }


    return (
        <div className="col-lg-9 pt-4 pb-2 pb-sm-4">
            <h1 className="h2 mb-4">Invoice</h1>
            <section className="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
                <div className="card-body">
                    <div className="row g-3 g-sm-4 mt-0 mt-lg-2">
                        <div className="col-sm-12">
                            { pdfJSX() }
                        </div>
                        <div className="col-12 d-flex justify-content-end pt-3">
                            <Link className="btn btn-secondary" to='/system/invoice'>Cancel</Link>
                            <button className='btn btn-primary ms-3' onClick={() => printHandler()} >Download Invoice</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ShowInvoice;