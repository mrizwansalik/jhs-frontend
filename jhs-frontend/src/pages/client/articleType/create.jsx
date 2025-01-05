
/* eslint-disable */
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import UpdateButton from '../../../components/button/Button';
import { checkFeaturePermission } from 'helpers/globalHelpers';

// functions
import { createArticleType, getAllArticleType } from '../../../store/admin/articleType/actions';

const Create = () => {
    const dispatch = useDispatch();
    const articleType = useSelector((state) => state.articleType.list);
    const permission = useSelector((state) => state.profile.role);

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({ reValidateMode: 'onChange' });

    useEffect(() => {
        if (permission && permission.length) {
            !checkFeaturePermission('articletype-add') && navigate('/system/articleType');
        }
    }, [permission]);

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(
            getAllArticleType({
                body: {},
                options: { __module: 'articleType' },
            }))
    }, []);

    const addArticleTypeHandle = (formData) => {
        
        const updatedElements = Object.keys(formData).filter(k => formData[k] === true);
        const data = {
            name: formData.name,
            elements: updatedElements
        }
        dispatch(
            createArticleType({
                body: { ...data },
                options: { btnLoader: true, __module: 'articleType', showToast: true },
            }));
    }
    if (!permission) {
        return '';
    }


    return (
        <div className="col-lg-9 pt-4 pb-2 pb-sm-4">
            <h1 className="h2 mb-4">Article Type</h1>
            {/* Article Type list */}
            <section className="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
                {checkFeaturePermission('articletype-add') ?
                    <div className="card-body">
                        <div className="d-flex align-items-center mt-sm-n1 pb-4 mb-0 mb-lg-1 mb-xl-3"><i className="ai-file text-primary lead pe-1 me-2" />
                            <h2 className="h4 mb-0">Add Article Type</h2>
                        </div>
                        <form onSubmit={handleSubmit(addArticleTypeHandle)}>
                            <div className="row g-3 g-sm-4 mt-0 mt-lg-2">
                                <div className="col-sm-12">
                                    <label className="form-label" htmlFor="name">Name</label>
                                    <input className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        {...register('name', {
                                            required: 'Type name is required',
                                        })} type="text" id="name" />
                                    <div className="invalid-feedback">{errors.name?.message}</div>
                                </div>
                                <div className="col-md-12 mb-3">
                                    <div key={permission?._id} className="row">
                                    <label className="form-label" htmlFor="elements">Elements</label>
                                        <div className='pt-0 pb-3'>
                                        <div key={"element-introduction"} className="col col-6 form-check form-check-inline">
                                                <input className="form-check-input" {...register("introduction", {  })} type="checkbox" />
                                                <label className="form-check-label" htmlFor="ex-check-4">Introduction</label>
                                            </div>
                                            <div key={"element-methodology"} className="col col-6 form-check form-check-inline">
                                                <input className="form-check-input" {...register("methodology", {  })} type="checkbox" />
                                                <label className="form-check-label" htmlFor="ex-check-4">Methodology</label>
                                            </div>
                                            <div key={"element-case-presentation"} className="col col-6 form-check form-check-inline">
                                                <input className="form-check-input" {...register("case_presentation", {  })} type="checkbox" />
                                                <label className="form-check-label" htmlFor="ex-check-4">Case Presentation</label>
                                            </div>
                                            <div key={"element-result"} className="col col-6 form-check form-check-inline">
                                                <input className="form-check-input" {...register("result", {  })} type="checkbox" />
                                                <label className="form-check-label" htmlFor="ex-check-4">Result</label>
                                            </div>
                                            <div key={"element-discussion"} className="col col-6 form-check form-check-inline">
                                                <input className="form-check-input" {...register("discussion", {  })} type="checkbox"/>
                                                <label className="form-check-label" htmlFor="ex-check-4">Discussion</label>
                                            </div>
                                            <div key={"element-conclusion"} className="col col-6 form-check form-check-inline">
                                                <input className="form-check-input" {...register("conclusion", {  })} type="checkbox" />
                                                <label className="form-check-label" htmlFor="ex-check-4">Conclusion</label>
                                            </div>
                                            <div key={"element-acknowledgement"} className="col col-6 form-check form-check-inline">
                                                <input className="form-check-input" {...register("acknowledgement", {  })} type="checkbox" />
                                                <label className="form-check-label" htmlFor="ex-check-4">Acknowledgement</label>
                                            </div>
                                            <div key={"element-disclosure"} className="col col-6 form-check form-check-inline">
                                                <input className="form-check-input" {...register("disclosure", {  })} type="checkbox"  />
                                                <label className="form-check-label" htmlFor="ex-check-4">Disclosure</label>
                                            </div>
                                            <div key={"element-supplementary"} className="col col-6 form-check form-check-inline">
                                                <input className="form-check-input" {...register("supplementary", {  })} type="checkbox"/>
                                                <label className="form-check-label" htmlFor="ex-check-4">Supplementary</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 d-flex justify-content-end pt-3">
                                    <Link className="btn btn-secondary" to='/system/articleType'>Cancel</Link>
                                    <UpdateButton className='btn btn-primary ms-3' title="Add Article Type" type='submit' />
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