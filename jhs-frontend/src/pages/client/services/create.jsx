
/* eslint-disable */
import React,{useEffect} from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch,useSelector } from 'react-redux';

import UpdateButton from '../../../components/button/Button';
import { checkFeaturePermission } from 'helpers/globalHelpers';

// function
import { createServices,getAllServices } from '../../../store/admin/services/actions';

const Create = () => {
    const dispatch = useDispatch();
    const permission = useSelector((state)=>state.profile.role);

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({ reValidateMode: 'onChange' });

    useEffect(()=>{
        if(permission && permission.length){
            !checkFeaturePermission('services-add') && navigate('/not-found');
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

    const addServicesHandle = (formData) => {
        dispatch(
            createServices({
                body: { ...formData },
                options: { btnLoader: true, __module: 'services', showToast: true },
            }));
    }
    if(!permission){
        return '';
    }


    return (
        <div className="col-lg-9 pt-4 pb-2 pb-sm-4">
            <h1 className="h2 mb-4">Services</h1>
            {/* Services list */}
            <section className="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
                {checkFeaturePermission('services-add') ?
                    <div className="card-body">
                        <div className="d-flex align-items-center mt-sm-n1 pb-4 mb-0 mb-lg-1 mb-xl-3"><i className="ai-tag text-primary lead pe-1 me-2" />
                            <h2 className="h4 mb-0">Add Services</h2>
                        </div>
                        <form onSubmit={handleSubmit(addServicesHandle)}>
                            <div className="row g-3 g-sm-4 mt-0 mt-lg-2">
                                <div className="col-sm-12">
                                    <label className="form-label" htmlFor="nt">Nick Title</label>
                                    <input className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        {...register('nickTitle', {
                                            required: 'Nick Title is required',
                                        })} type="text" id="nt" />
                                    <div className="invalid-feedback">{errors.name?.message}</div>
                                </div>
                                <div className="col-sm-12">
                                    <label className="form-label" htmlFor="title">Display Title</label>
                                    <input className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        {...register('title', {
                                            required: 'Title is required',
                                        })} type="text" id="title" />
                                    <div className="invalid-feedback">{errors.name?.message}</div>
                                </div>
                                <div className="col-sm-12">
                                    <label className="form-label" htmlFor="message">Description</label>
                                    <input className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                                        {...register('description', {
                                            required: 'Description is required',
                                        })} type="text" id="description" />
                                    <div className="invalid-feedback">{errors.message?.message}</div>
                                </div>
                                <div className="col-sm-12">
                                    <label className="form-label" htmlFor="price">Price</label>
                                    <input className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                                        {...register('price', {
                                            required: 'Price is required',
                                        })} type="text" id="price" />
                                    <div className="invalid-feedback">{errors.message?.message}</div>
                                </div>
                                <div className="col-12 d-flex justify-content-end pt-3">
                                    <Link className="btn btn-secondary" to='/system/services'>Cancel</Link>
                                    <UpdateButton className='btn btn-primary ms-3' title="Add Services" type='submit' />
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

export default Create;