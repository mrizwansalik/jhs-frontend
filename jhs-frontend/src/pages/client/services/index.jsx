/* eslint-disable */
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';

import { checkFeaturePermission } from 'helpers/globalHelpers';

// function
import { getAllServices } from '../../../store/admin/services/actions';

const Services = () => {
    const dispatch = useDispatch();
    const services = useSelector((state) => state.services.list);
    const permission = useSelector((state)=>state.profile.role);

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({ reValidateMode: 'onChange' });

    useEffect(()=>{
        if(permission && permission.length){
            !checkFeaturePermission('services-view') && Navigate('/not-found');
        }
    },[permission]);
    
    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(
            getAllServices({
                body: {},
                options: { __module: 'services' },
            }))
    }, []);
    
    if(!permission || !services){
        return '';
    }

    return (
        <>
            <div className="col-lg-9 pt-4 pb-2 pb-sm-4">
                {/* Services list */}
                <section className="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
                    <div className="card-body">
                        <div className="d-flex align-items-center mt-sm-n1 pb-4 mb-0 mb-lg-1 mb-xl-3">
                            <i className="ai-tag text-primary lead pe-1 me-2" />
                            <h2 className="h4 mb-0">Services Information</h2>
                            {checkFeaturePermission('services-add') ?
                                <Link className="btn btn-sm btn-secondary ms-auto" to="/system/services/create">
                                    Add Services
                                </Link>
                                : ''}
                        </div>

                        <div className="table-responsive">
                            <table className="table table-hover">
                                <tbody><tr>
                                    <th>#</th>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Price</th>
                                    <th>Action</th>
                                </tr>
                                </tbody>
                                <tbody>
                                    {services && services.map((data, index) => {
                                        return (
                                            <tr key={"tr-" + data._id}>
                                                <th scope="row">{++index}</th>
                                                <td>{data?.title}</td>
                                                <td>{data?.description}</td>
                                                <td>{data?.price}</td>
                                                <td>
                                                    {
                                                        checkFeaturePermission('services-update') ?
                                                            <Link className="btn btn-primary btn-sm btn-icon mb-2 me-2" to={"/system/services/" + data._id + "/edit"} data-bs-toggle="tooltip" aria-label="Edit">
                                                                <i className="ai-edit"></i>
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

export default Services;