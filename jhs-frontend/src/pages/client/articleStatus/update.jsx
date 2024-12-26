
/* eslint-disable */
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import UpdateButton from '../../../components/button/Button';
import { checkFeaturePermission } from 'helpers/globalHelpers';

// functions
import { getArticleStatus, updateArticleStatus,getAllArticleStatus } from '../../../store/admin/articleStatus/actions';

const Update = () => {
    const dispatch = useDispatch();
    let { articleStatusId } = useParams();
    const articleStatusInfo = useSelector((state) => state.articleStatus.single);
    const permission = useSelector((state)=>state.profile.role);

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm({ reValidateMode: 'onChange' });

    useEffect(()=>{
        if(permission && permission.length){
            !checkFeaturePermission('articlestatus-update') && navigate('/not-found');
        }
    },[permission]);

    useEffect(() => {
        reset();
    }, [articleStatusInfo]);

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(getArticleStatus({
            body: {},
            options: { id: articleStatusId, btnLoader: true, __module: 'articleStatus', },
        }));
        dispatch(
            getAllArticleStatus({
                body: {},
                options: { __module: 'articleStatus' },
            }))
    }, []);

    const updateArticleStatusHandle = (formData) => {
        dispatch(
            updateArticleStatus({
                body: { ...formData },
                options: { id: articleStatusId, btnLoader: true, __module: 'articleStatus', showToast: true },
            }));
    }
    if(!permission || !articleStatusInfo){
        return '';
    }


    return (
        <div className="col-lg-9 pt-4 pb-2 pb-sm-4">
            <h1 className="h2 mb-4">ArticleStatus</h1>
            <section className="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
                {checkFeaturePermission('articlestatus-update') ?
                    <div className="card-body">
                        <div className="d-flex align-items-center mt-sm-n1 pb-4 mb-0 mb-lg-1 mb-xl-3"><i className="ai-tag text-primary lead pe-1 me-2" />
                            <h2 className="h4 mb-0">Edit Article Status</h2>
                        </div>
                        <form onSubmit={handleSubmit(updateArticleStatusHandle)}>
                            <div className="row g-3 g-sm-4 mt-0 mt-lg-2">
                                <div className="col-sm-12">
                                    <label className="form-label" htmlFor="name">Status Name</label>
                                    <input className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        {...register('name', {
                                            required: 'Status name is required',
                                            value: articleStatusInfo?.name
                                        })} type="text" id="name" />
                                    <div className="invalid-feedback">{errors.name?.message}</div>
                                </div>
                                <div className="col-sm-6">
                                    <label className="form-label" htmlFor="type">Status Type</label>
                                    <input className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        {...register('type', {
                                            required: 'Status type is required',
                                            value: articleStatusInfo?.type
                                        })} type="text" id="type" />
                                    <div className="invalid-feedback">{errors.type?.message}</div>
                                </div>
                                <div className="col-sm-6">
                                    <label className="form-label" htmlFor="message">Message</label>
                                    <input className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                                        {...register('message', {
                                            required: "Type is required",
                                            value: articleStatusInfo?.message
                                        })} type="text" id="message" />
                                    <div className="invalid-feedback">{errors.message?.message}</div>
                                </div>
                                <div className="col-12 d-flex justify-content-end pt-3">
                                    <Link className="btn btn-secondary" to='/system/articleStatus'>Cancel</Link>
                                    <UpdateButton className='btn btn-primary ms-3' title="Save ArticleStatus" type='submit' />
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