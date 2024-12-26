/* eslint-disable */
import React, { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import UpdateButton from '../../../../components/button/Button';
import { submitArticleLanguageCorrection } from 'store/main/articlesLanguageCorrection/actions';

const LanguageCorrectionSubmit = () => {
    const dispatch = useDispatch();
    let { articleId } = useParams();
    const articleInfo = useSelector((state) => state.articleLanguageCorrection.single);

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm({ reValidateMode: 'onChange' });

    useEffect(() => {
        reset();
    }, [articleInfo]);

    const submitArticleHandle = (formData) => {
        dispatch(
            submitArticleLanguageCorrection({
                body: { ...formData },
                options: { id: articleId, btnLoader: true, __module: 'articleLanguageCorrection', showToast: true },
            }));
    }

    return (
        <div className="col-lg-9">
            {/* Journals list */}
            <section className="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
                <div className="card-body">
                    <form onSubmit={handleSubmit(submitArticleHandle)}>
                        <div className="row g-3 g-sm-4">
                            <div className="col-sm-12">
                                <div className="text-center text-lg-start ">
                                    <h3 className="h3 mb-4">
                                        You made it! Please preview and submit your revision.
                                    </h3>
                                    <p className="pb-2 mb-2">
                                        Please take one last look at your article to ensure your citations, media and references are all in order. You will notified with the result of our initial review within two to three days of submission.
                                    </p>
                                    <div className="pb-3">
                                            <textarea 
                                                className={`form-control ${errors.processingText ? 'is-invalid' : ''}`}
                                                {...register('processingText', {
                                                    required: 'Submission message is required',
                                                })}
                                                rows={5} placeholder="Submission message"  id="processingText" />
                                        <div className="invalid-feedback">{errors.processingText?.message}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 d-flex justify-content-end pt-3">
                                <Link className="btn btn-secondary" to='/main/dashboard'>Cancel</Link>
                                <UpdateButton className='btn btn-primary ms-3' title="Submit for Approval" type='submit' />
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default LanguageCorrectionSubmit;