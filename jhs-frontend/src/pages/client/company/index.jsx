
/* eslint-disable */
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { checkFeaturePermission } from 'helpers/globalHelpers';

// functions
import { getCompanyWithOwner } from '../../../store/admin/company/actions';

const Company = () => {
    const dispatch = useDispatch();
    const company = useSelector((state) => state.companies.single);
    const permission = useSelector((state) => state.profile.role);

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({ reValidateMode: 'onChange' });

    useEffect(() => {
        if (permission && permission.length) {
            !checkFeaturePermission('company-view') && navigate('/not-found');
        }
    }, [permission]);

    useEffect(() => {
        window.scrollTo(0, 0);
        
        dispatch(
            getCompanyWithOwner({
                body: {},
                options: { __module: 'company' },
            }))
    }, []);

    if (!permission) {
        return '';
    }

    let companyComponent = "";
    if (company) {
        companyComponent = <>
            <div className="d-md-flex align-items-center">
                <div className="d-sm-flex align-items-center">
                    <div className="pt-2">
                        <h3 className="h5 mb-2">{company?.name}<i className="ai-circle-check-filled fs-base text-success ms-2" /></h3>
                        <div className="text-muted fw-medium d-flex flex-wrap flex-sm-nowrap align-items-center">
                            <div className="d-flex align-items-center me-3"><i className="ai-mail me-1" />{company?.email}</div>
                            <div className="d-flex align-items-center me-3"><i className="ai-phone me-1" />{company?.phone}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row py-4 mb-2 mb-sm-3">
                <div className="col-md-12 mb-4 mb-md-0">
                    <table className="table mb-0">
                        <tbody>
                            <tr>
                                <td width={'20vh'} className="border-0 text-muted py-1 px-0">Address</td>
                                <td className="border-0 text-dark fw-medium py-1 ps-3">{company?.address}</td>
                            </tr>
                            <tr>
                                <td className="border-0 text-muted py-1 px-0">Place</td>
                                <td className="border-0 text-dark fw-medium py-1 ps-3">{company?.city + "," + company?.city}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>;
    }
    return (
        <div className="col-lg-9 pt-4 pb-2 pb-sm-4">
            {/*Company Information*/}
            <section className="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
                <div className="card-body">
                    <div className="d-flex align-items-center mt-sm-n1 pb-4 mb-0 mb-lg-1 mb-xl-3"><i className="ai-flag text-primary lead pe-1 me-2" />
                        <h2 className="h4 mb-0">Company Information</h2>
                        <Link to='/system/company/update' className="btn btn-sm btn-secondary ms-auto">  <i className="ai-edit ms-n1 me-2" />Edit Company info</Link>
                    </div>
                    {companyComponent}
                </div>
            </section>
        </div>
    );
};

export default Company;