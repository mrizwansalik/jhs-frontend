
/* eslint-disable */
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import UpdateButton from '../../../components/button/Button';
import { checkFeaturePermission } from 'helpers/globalHelpers';

// functions
import { getArticleType, updateArticleType,getAllArticleType } from '../../../store/admin/articleType/actions';

const Update = () => {
    const dispatch = useDispatch();
    let { articleTypeId } = useParams();
    const articleTypeInfo = useSelector((state) => state.articleType.single);
    const permission = useSelector((state)=>state.profile.role);

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm({ reValidateMode: 'onChange' });

    useEffect(()=>{
        if(permission && permission.length){
            !checkFeaturePermission('articletype-update') && navigate('/system/articleType');
        }
    },[permission]);

    useEffect(() => {
        reset();
    }, [articleTypeInfo]);

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(getArticleType({
            body: {},
            options: { id: articleTypeId, btnLoader: true, __module: 'articleType', },
        }));
        dispatch(
            getAllArticleType({
                body: {},
                options: { __module: 'articleType' },
            }))
    }, []);

    const updateArticleTypeHandle = (formData) => {
        const updatedElements = Object.keys(formData).filter(k => formData[k] === true);
        const data = {
            name: formData.name,
            elements: updatedElements
        }
        dispatch(
            updateArticleType({
                body: { ...data },
                options: { id: articleTypeId, btnLoader: true, __module: 'articleType', showToast: true },
            }));
    }
    if(!permission || !articleTypeInfo){
        return '';
    }


    return (
        <div className="col-lg-9 pt-4 pb-2 pb-sm-4">
            <h1 className="h2 mb-4">Article Type</h1>
            <section className="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
                {checkFeaturePermission('articletype-update') ?
                    <div className="card-body">
                        <div className="d-flex align-items-center mt-sm-n1 pb-4 mb-0 mb-lg-1 mb-xl-3"><i className="ai-tag text-primary lead pe-1 me-2" />
                            <h2 className="h4 mb-0">Edit Article Type</h2>
                        </div>
                        <form onSubmit={handleSubmit(updateArticleTypeHandle)}>
                            <div className="row g-3 g-sm-4 mt-0 mt-lg-2">
                                <div className="col-sm-12">
                                    <label className="form-label" htmlFor="name">Type Name</label>
                                    <input className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        {...register('name', {
                                            required: 'Type name is required',
                                            value: articleTypeInfo?.name
                                        })} type="text" id="name" />
                                    <div className="invalid-feedback">{errors.name?.message}</div>
                                </div>
                                <div className="col-md-12 mb-3">
                                    <div key={permission?._id} className="row">
                                    <label className="form-label" htmlFor="elements">Elements</label>
                                        <div className='pt-0 pb-3'>
                                            <div key={"element-introduction"} className="col col-6 form-check form-check-inline">
                                                <input className="form-check-input" {...register("introduction", { value: articleTypeInfo.elements.includes(`introduction`) })} type="checkbox" />
                                                <label className="form-check-label" htmlFor="ex-check-4">Introduction</label>
                                            </div>
                                            <div key={"element-methodology"} className="col col-6 form-check form-check-inline">
                                                <input className="form-check-input" {...register("methodology", { value: articleTypeInfo.elements.includes(`methodology`) })} type="checkbox" />
                                                <label className="form-check-label" htmlFor="ex-check-4">Methodology</label>
                                            </div>
                                            <div key={"element-case-presentation"} className="col col-6 form-check form-check-inline">
                                                <input className="form-check-input" {...register("case_presentation", { value: articleTypeInfo.elements.includes(`case_presentation`) })} type="checkbox" />
                                                <label className="form-check-label" htmlFor="ex-check-4">Case Presentation</label>
                                            </div>
                                            <div key={"element-result"} className="col col-6 form-check form-check-inline">
                                                <input className="form-check-input" {...register("result", { value: articleTypeInfo.elements.includes(`result`) })} type="checkbox" />
                                                <label className="form-check-label" htmlFor="ex-check-4">Result</label>
                                            </div>
                                            <div key={"element-discussion"} className="col col-6 form-check form-check-inline">
                                                <input className="form-check-input" {...register("discussion", { value: articleTypeInfo.elements.includes(`discussion`) })} type="checkbox"/>
                                                <label className="form-check-label" htmlFor="ex-check-4">Discussion</label>
                                            </div>
                                            <div key={"element-conclusion"} className="col col-6 form-check form-check-inline">
                                                <input className="form-check-input" {...register("conclusion", { value: articleTypeInfo.elements.includes(`conclusion`) })} type="checkbox" />
                                                <label className="form-check-label" htmlFor="ex-check-4">Conclusion</label>
                                            </div>
                                            <div key={"element-acknowledgement"} className="col col-6 form-check form-check-inline">
                                                <input className="form-check-input" {...register("acknowledgement", { value: articleTypeInfo.elements.includes(`acknowledgement`) })} type="checkbox" />
                                                <label className="form-check-label" htmlFor="ex-check-4">Acknowledgement</label>
                                            </div>
                                            <div key={"element-disclosure"} className="col col-6 form-check form-check-inline">
                                                <input className="form-check-input" {...register("disclosure", { value: articleTypeInfo.elements.includes(`disclosure`) })} type="checkbox"  />
                                                <label className="form-check-label" htmlFor="ex-check-4">Disclosure</label>
                                            </div>
                                            <div key={"element-supplementary"} className="col col-6 form-check form-check-inline">
                                                <input className="form-check-input" {...register("supplementary", { value: articleTypeInfo.elements.includes(`supplementary`) })} type="checkbox"/>
                                                <label className="form-check-label" htmlFor="ex-check-4">Supplementary</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 d-flex justify-content-end pt-3">
                                    <Link className="btn btn-secondary" to='/system/articleType'>Cancel</Link>
                                    <UpdateButton className='btn btn-primary ms-3' title="Save ArticleType" type='submit' />
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