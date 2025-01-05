/* eslint-disable */
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate,useParams } from 'react-router-dom';

import UpdateButton from '../../../components/button/Button';
import { checkFeaturePermission } from 'helpers/globalHelpers';

// functions
import { updateArticleRatingList,getArticleRatingList } from '../../../store/admin/articleRatingList/actions';

const Update = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const permission = useSelector((state) => state.profile.role);
    const articleRatingList = useSelector((state) => state.articleRatingList.single);
    const { articleRatingListId } = useParams();

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm({ reValidateMode: 'onChange' });

    useEffect(()=>{
        dispatch(
            getArticleRatingList({
                body: {},
                options: { id:articleRatingListId, btnLoader: true, __module: 'articleRatingList' },
            }));
    },[dispatch, articleRatingListId]);

    useEffect(() => {
        reset();
    }, [articleRatingList, reset]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    
    useEffect(() => {
        if (permission && permission.length) {
            !checkFeaturePermission('articleratinglist-update') && navigate('/system/articleRatingList');
        }
    }, [permission, navigate]);

    const updateHandle = (formData) => {
        dispatch(
            updateArticleRatingList({
                body: { ...formData },
                options: { id:articleRatingListId, btnLoader: true, __module: 'articleRatingList', showToast: true },
            }));
    }

    if (!permission || !articleRatingList) {
        return '';
    }
    return (
        <>
            <div className="col-lg-9 pt-4 pb-2 pb-sm-4">
                <h1 className="h2 mb-4">Article Rating List Item</h1>
                {/* Companies list */}
                <section className="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
                    <div className="card-body">
                        <div className="d-flex align-items-center mt-sm-n1 pb-4 mb-0 mb-lg-1 mb-xl-3"><i className="ai-tag text-primary lead pe-1 me-2" />
                            <h2 className="h4 mb-0">Update Article Rating Item</h2>
                        </div>
                        <form onSubmit={handleSubmit(updateHandle)}>
                            <div className="row g-3 g-sm-4 mt-0 mt-lg-2">
                                <div className="col-sm-12">
                                    <label className="form-label" htmlFor="title">Title</label>
                                    <input className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                        {...register('title', {
                                            required: 'Title is required', value:articleRatingList?.title
                                        })} type="text" id="title" placeholder='Article Rating Item Title...' />
                                    <div className="invalid-feedback">{errors.title?.message}</div>
                                </div>
                                <div className="col-sm-12">
                                    <label className="form-label" htmlFor="description">Description</label>
                                    <input className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                        {...register('description', {
                                            required: 'Description is required', value:articleRatingList?.description
                                        })} type="text" id="description"  placeholder='Article Rating Item Description...' />
                                    <div className="invalid-feedback">{errors.description?.message}</div>
                                </div>
                                <div className="col-12 d-flex justify-content-end pt-3">
                                    <Link className="btn btn-secondary" to='/system/articleRatingList'>Cancel</Link>
                                    <UpdateButton className='btn btn-primary ms-3' title="Update Article Rating Item" type='submit' />
                                </div>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Update;