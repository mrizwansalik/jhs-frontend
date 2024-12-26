
/* eslint-disable */
import React,{useEffect} from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch,useSelector } from 'react-redux';

import UpdateButton from '../../../components/button/Button';
import { checkFeaturePermission } from 'helpers/globalHelpers';

// functions
import { createArticleStatus,getAllArticleStatus } from '../../../store/admin/articleStatus/actions';

const Create = () => {
    const dispatch = useDispatch();
    const articleStatus = useSelector((state) => state.articleStatus.list);
    const permission = useSelector((state)=>state.profile.role);

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({ reValidateMode: 'onChange' });

    useEffect(()=>{
        if(permission && permission.length){
            !checkFeaturePermission('articlestatus-add') && navigate('/not-found');
        }
    },[permission]);

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(
            getAllArticleStatus({
                body: {},
                options: { __module: 'articleStatus' },
            }))
    }, []);

    const addArticleStatusHandle = (formData) => {
        dispatch(
            createArticleStatus({
                body: { ...formData },
                options: { btnLoader: true, __module: 'articleStatus', showToast: true },
            }));
    }
    if(!permission){
        return '';
    }


    return (
        <div className="col-lg-9 pt-4 pb-2 pb-sm-4">
            <h1 className="h2 mb-4">Article Status</h1>
            {/* Article Status list */}
            <section className="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
                {checkFeaturePermission('articlestatus-add') ?
                    <div className="card-body">
                        <div className="d-flex align-items-center mt-sm-n1 pb-4 mb-0 mb-lg-1 mb-xl-3"><i className="ai-tag text-primary lead pe-1 me-2" />
                            <h2 className="h4 mb-0">Add Article Status</h2>
                        </div>
                        <form onSubmit={handleSubmit(addArticleStatusHandle)}>
                            <div className="row g-3 g-sm-4 mt-0 mt-lg-2">
                                <div className="col-sm-12">
                                    <label className="form-label" htmlFor="fn">Name</label>
                                    <input className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        {...register('name', {
                                            required: 'Status name is required',
                                        })} type="text" id="fn" />
                                    <div className="invalid-feedback">{errors.name?.message}</div>
                                </div>
                                <div className="col-sm-6">
                                    <label className="form-label" htmlFor="type">Status Type</label>
                                    <input className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        {...register('type', {
                                            required: 'Status type is required',
                                        })} type="text" id="type" />
                                    <div className="invalid-feedback">{errors.type?.message}</div>
                                </div>
                                <div className="col-sm-6">
                                    <label className="form-label" htmlFor="message">Message</label>
                                    <input className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                                        {...register('message', {
                                            required: 'Status message is required',
                                        })} type="text" id="message" />
                                    <div className="invalid-feedback">{errors.message?.message}</div>
                                </div>
                                <div className="col-12 d-flex justify-content-end pt-3">
                                    <Link className="btn btn-secondary" to='/system/articleStatus'>Cancel</Link>
                                    <UpdateButton className='btn btn-primary ms-3' title="Add Article Status" type='submit' />
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