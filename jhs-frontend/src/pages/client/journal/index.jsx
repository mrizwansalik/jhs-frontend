
/* eslint-disable */
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { checkFeaturePermission } from 'helpers/globalHelpers';

// functions
import { getJournalWithManager } from '../../../store/admin/journal/actions';

const Journal = () => {
    const dispatch = useDispatch();
    const journal = useSelector((state) => state.journals.single);
    const permission = useSelector((state) => state.profile.role);

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({ reValidateMode: 'onChange' });

    useEffect(() => {
        if (permission && permission.length) {
            !checkFeaturePermission('journal-view') && navigate('/system');
        }
    }, [permission]);

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(
            getJournalWithManager({
                body: {},
                options: { __module: 'journal' },
            }))
    }, [dispatch]);

    if (!permission) {
        return '';
    }

    let journalComponent = "";
    if (journal) {
        journalComponent = <>
            <div className="d-md-flex">
                <div className="col-md-6 mb-4 mb-md-0">
                    <div className="d-sm-flex align-items-center">
                        <div className="pt-2 mb-4">
                            <h3 className="h5 mb-2">{journal?.name}<i className="ai-circle-check-filled fs-base text-success ms-2" /></h3>
                            <div className="text-muted fw-medium d-flex flex-wrap flex-sm-nowrap align-items-center">
                                <div className="d-flex align-items-center me-3"><i className="ai-bookmark me-1" />{journal?.type}</div>
                            </div>
                        </div>
                    </div>
                    <table className="table mb-0">
                        <tbody>
                            <tr>
                                <td width={'20%'} className="border-0 text-muted py-1 px-0">DOI Prefix</td>
                                <td className="border-0 text-dark fw-medium py-1 ps-3">{journal?.doiPrefix}</td>
                            </tr>
                            <tr>
                                <td className="border-0 text-muted py-1 px-0">eISSN</td>
                                <td className="border-0 text-dark fw-medium py-1 ps-3">{journal?.eISSN}</td>
                            </tr>
                            <tr>
                                <td className="border-0 text-muted py-1 px-0">pISSN</td>
                                <td className="border-0 text-dark fw-medium py-1 ps-3">{journal?.pISSN}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="col-md-6 d-md-flex justify-content-end">
                    <div className="w-100 border rounded-3 p-4" style={{ maxWidth: 250 }}>
                        <img
                            className="d-block mb-2"
                            src="/assets/img/book.jpg"
                            width={'100%'}
                            alt="Gift icon"
                        />
                    </div>
                </div>
            </div>
        </>;
    }
    return (
        <div className="col-lg-9 pt-4 pb-2 pb-sm-4">
            {/*Journal Information*/}
            <section className="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
                <div className="card-body">
                    <div className="d-flex align-items-center mt-sm-n1 pb-4 mb-0 mb-lg-1 mb-xl-3"><i className="ai-open-book text-primary lead pe-1 me-2" />
                        <h2 className="h4 mb-0">Journal Information</h2>
                        <Link to='/system/journal/update' className="btn btn-sm btn-secondary ms-auto">  <i className="ai-edit ms-n1 me-2" />Edit Journal info</Link>
                    </div>
                    {journalComponent}
                </div>
            </section>
        </div>
    );
};

export default Journal;