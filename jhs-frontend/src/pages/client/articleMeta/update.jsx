
/* eslint-disable */
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import UpdateButton from '../../../components/button/Button';
import { checkFeaturePermission } from 'helpers/globalHelpers';

// functions
import { getArticleMeta, updateArticleMeta,getAllArticleMeta } from '../../../store/admin/articleMeta/actions';

const UpdateMeta = () => {
    const dispatch = useDispatch();
    let { articleMetaId } = useParams();
    const articleMetaInfo = useSelector((state) => state.articleMeta.single);
    const permission = useSelector((state)=>state.profile.role);

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm({ reValidateMode: 'onChange' });

    useEffect(()=>{
        if(permission && permission.length){
            !checkFeaturePermission('articlemeta-update') && navigate('/system/articleMeta');
        }
    },[permission]);

    useEffect(() => {
        reset();
    }, [articleMetaInfo]);

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(getArticleMeta({
            body: {},
            options: { id: articleMetaId, btnLoader: true, __module: 'articleMeta', },
        }));
        dispatch(
            getAllArticleMeta({
                body: {},
                options: { __module: 'articleMeta' },
            }))
    }, []);

    const updateArticleMetaHandle = (formData) => {
        dispatch(
            updateArticleMeta({
                body: { ...formData },
                options: { id: articleMetaId, btnLoader: true, __module: 'articleMeta', showToast: true },
            }));
    }
    if(!permission || !articleMetaInfo){
        return '';
    }


    return (
        <div className="col-lg-9 pt-4 pb-2 pb-sm-4">
            <h1 className="h2 mb-4">Article Meta</h1>
            <section className="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
                {checkFeaturePermission('articlemeta-update') ?
                    <div className="card-body">
                        <div className="d-flex align-items-center mt-sm-n1 pb-4 mb-0 mb-lg-1 mb-xl-3"><i className="ai-tag text-primary lead pe-1 me-2" />
                            <h2 className="h4 mb-0">Edit Article Meta</h2>
                        </div>
                        <form onSubmit={handleSubmit(updateArticleMetaHandle)}>
                            <div className="row g-3 g-sm-4 mt-0 mt-lg-2">
                                <div className="col-sm-12">
                                    <label className="form-label" htmlFor="fn">Status Name</label>
                                    <input className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        {...register('name', {
                                            required: 'Status name is required',
                                            value: articleMetaInfo?.name
                                        })} type="text" id="fn" />
                                    <div className="invalid-feedback">{errors.name?.message}</div>
                                </div>
                                <div className="col-12 d-flex justify-content-end pt-3">
                                    <Link className="btn btn-secondary" to='/system/articleMeta'>Cancel</Link>
                                    <UpdateButton className='btn btn-primary ms-3' title="Save Article Meta" type='submit' />
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

export default UpdateMeta;