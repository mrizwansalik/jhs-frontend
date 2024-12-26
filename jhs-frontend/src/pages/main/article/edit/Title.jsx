/* eslint-disable */
import React, { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import UpdateButton from '../../../../components/button/Button';
import { updateDraftArticle } from '../../../../store/main/articles/actions'

const Title = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let { articleId } = useParams();
    const articleInfo = useSelector((state) => state.article.singleDraft);

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm({ reValidateMode: 'onChange' });

    useEffect(() => {
        reset();
    }, [articleInfo]);

    const updateDraftArticleHandle = (formData) => {
        dispatch(
            updateDraftArticle({
                body: { ...formData },
                options: { id: articleId, btnLoader: true, __module: 'article', showToast: true },
            }));
        navigate(`/main/article/${articleId}/edit/category`);
    }

    return (
        <div className="col-lg-9">
            {/* Journals list */}
            <section className="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
                <div className="card-body">
                    <form onSubmit={handleSubmit(updateDraftArticleHandle)}>
                        <div className="row g-3 g-sm-4">
                            <div className="col-sm-12">
                                <div className="text-center text-lg-start ">
                                    <h3 className="h3 mb-4">
                                        What's the title of your article?
                                    </h3>
                                    <p className="pb-2 mb-2">
                                        Title should be entered in APA Style Title Case. Failure to do so will hurt your chances of receiving free publication. Title should be limited to one sentence only. Do not include a period at the end of the title. Show me an example.
                                    </p>
                                    <div className="pb-3">
                                        <input className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                            {...register('title', {
                                                required: 'Article title is required',
                                                value: articleInfo?.title
                                            })} type="text" id="title" />
                                        <div className="invalid-feedback">{errors.title?.message}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 d-flex justify-content-end pt-3">
                                <Link className="btn btn-secondary" to='/main/dashboard/article/draft'>Cancel</Link>
                                <UpdateButton className='btn btn-primary ms-3' title="Save & Continue" type='submit' />
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default Title;