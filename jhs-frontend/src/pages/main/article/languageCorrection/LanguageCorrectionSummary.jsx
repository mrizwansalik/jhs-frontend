/* eslint-disable */
import React, { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { validateArticleLanguageCorrection } from 'store/main/articlesLanguageCorrection/actions';

const LanguageCorrectionSummary = () => {
    const dispatch = useDispatch();
    let { articleId } = useParams();
    const articleInfo = useSelector((state) => state.articleLanguageCorrection.single);
    const articleErrors = useSelector((state) => state.form.errors);
    const navigate = useNavigate();

    const {
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm({ reValidateMode: 'onChange' });

    useEffect(() => {
        reset();
    }, [articleInfo]);

    useEffect(() => {
        validateArticleHandle();
    }, []);

    const validateArticleHandle = () => {
        dispatch(
            validateArticleLanguageCorrection({
                options: { id: articleId, btnLoader: true, __module: 'articleLanguageCorrection', showToast: true },
            }));
    }

    return (
        <div className="col-lg-9">
            {/* Journals list */}
            <section className="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
                <div className="card-body">
                    <form onSubmit={handleSubmit(validateArticleHandle)}>
                        <div className="row g-3 g-sm-4">
                            <div className="col-sm-12">
                                <div className="text-center text-lg-start ">
                                    <h3 className="h3 mb-4">
                                        Errors Summary for Article!
                                    </h3>
                                    {
                                        ((articleErrors?.warningMessages?.length != 0 || articleErrors?.referencesWarningMessages?.length != 0) && articleErrors.length != 0) ?
                                            <>
                                                {

                                                    articleErrors?.warningMessages?.map((item, index) => {
                                                        return (
                                                            <div className="alert alert-danger" role="alert">

                                                                <h4 className="h5 alert-heading text-capitalize"><i className="ai-circle-slash fs-xl pe-1 me-2" />{item.type}:</h4>
                                                                <p>{item.message} </p>
                                                                <Link to={`/main/article/${articleId}/languageCorrection/${item.goto}`} className="alert-link text-capitalize"> Go To {item.goto} Page</Link>
                                                            </div>
                                                        );
                                                    })
                                                }
                                                {
                                                    (articleErrors?.referencesWarningMessages?.length != 0) ?
                                                        <div className="alert alert-danger mb-0" role="alert">
                                                            <h4 className="h5 alert-heading text-capitalize"><i className="ai-circle-slash fs-xl pe-1 me-2" />Missing citations: </h4>
                                                            <p>
                                                                We are unable to locate citations for the following reference(s). They may be incorrectly formatted or missing entirely..
                                                            </p>
                                                            <Link to={`/main/article/${articleId}/languageCorrection/reference`} className="alert-link text-capitalize"> Go To Article Reference Page</Link>
                                                            <hr className="text-danger opacity-25 mb-3 mt-3" />
                                                            <ul className='mb-2'>
                                                                {
                                                                    articleErrors?.referencesWarningMessages?.map((item, index) => {
                                                                        return (
                                                                            <li key={`referencesWarningMessages${index}`} className='fs-sm'>{item.message} </li>
                                                                        );
                                                                    })
                                                                }
                                                            </ul>
                                                        </div>
                                                        : <></>
                                                }

                                            </>
                                            : (
                                                <div className="card-body">
                                                    <h4 className="card-title">Article Verified</h4>
                                                    <p className="card-text">Please move next to submit this article for editor check</p>
                                                    <Link className="btn btn-outline-primary" to={`/main/article/${articleId}/previewDraft`}>View Article Draft</Link>
                                                    <Link className="btn btn-primary ms-3" to={`/main/article/${articleId}/languageCorrection/submit`}>Move to submit</Link>
                                                </div>
                                            )
                                    }
                                </div>
                            </div>
                            <div className="col-12 d-flex justify-content-end pt-3">
                                <Link className="btn btn-secondary" to='/main/dashboard'>Cancel</Link>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default LanguageCorrectionSummary;