/* eslint-disable */
import React, { useEffect } from 'react';
import { getStarted } from '../../../store/main/articles/actions'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import UpdateButton from '../../../components/button/Button';
import { getAllArticleType } from '../../../store/admin/articleType/actions'


const GetStarted = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.profile.profile);
    const articleTypes = useSelector((state) => state.articleType.list);

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({ reValidateMode: 'onChange' });

    useEffect(() => {
        dispatch(getAllArticleType({ body: {}, options: { __module: 'articleType', } }));
    }, []);
    
    const getStartedHandler = (formData) => {
        let selectedArticle = articleTypes.filter((article) => article.name === formData.type);
        dispatch({ type: 'SELECTED_ARTICLE', payload: selectedArticle[0] });
        dispatch(
            getStarted({
                body: { ...formData },
                options: { btnLoader: true, __module: 'article', showToast: true },
            }));
    }

    return (
        <form onSubmit={handleSubmit(getStartedHandler)}>
            <div className="card col-lg-12 mt-4">
                <div className="card-header text-center">
                    <h2 className='mb-0'>Hi, {user?.full_name}</h2>
                </div>
                <div className="card-body">
                    <div className="card-title">
                        <img
                            src="/assets/img/articleFlow/publishing-infographic.png"
                            width={"100%"}
                            alt="User icon"
                        />
                    </div>
                    <div className="row align-items-center px-sm-0 px-md-2 px-lg-3 px-xl-5 mx-sm-0 mx-md-2 mx-lg-3 mx-xl-5">
                        <div className="col-lg-12 col-xl-12 col-xxl-12">
                            <div className="row row-cols-1 row-cols-sm-1 row-cols-md-1 row-cols-lg-2">
                                <div className="col">
                                    <div className="card border-0 bg-faded-primary">
                                        <div className="card-body">
                                            <i className="ai-user fs-1 text-primary d-block mb-3" />
                                            <h3 className="h4">Author Instructions</h3>
                                            <p className="fs-sm">
                                                Please ensure you have read these instructions before starting your submission! We expect all submissions to studiously adhere to our formatting requirements. Articles with too many errors will either be rejected or require the purchase of our Preferred Editing service.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="card border-0 bg-faded-info mt-4">
                                        <div className="card-body">
                                            <i className="ai-star-filled fs-1 text-info d-block mb-3" />
                                            <h3 className="h4">Your Responsibilities</h3>
                                            <ul className="list-unstyled pb-3 mb-3 mb-lg-4">
                                                <li className="d-flex pt-2">
                                                    <i className="ai-check-alt fs-4 text-info mt-n1 me-2" />
                                                    Authors cannot be added after article submission.
                                                </li>
                                                <li className="d-flex pt-2">
                                                    <i className="ai-check-alt fs-4 text-info mt-n1 me-2" />
                                                    Only the submitting author can edit the article, author names and affiliations.
                                                </li>
                                                <li className="d-flex pt-2">
                                                    <i className="ai-check-alt fs-4 text-info mt-n1 me-2" />
                                                    If you are submitting on behalf of an author you must sign in with the author’s account before continuing.
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="col pt-sm-4 pt-lg-3">
                                    <div className="card border-0 bg-faded-warning mt-4 mt-sm-0 mt-lg-4">
                                        <div className="card-body">
                                            <i className="ai-bulb-alt fs-1 text-warning d-block mb-3" />
                                            <h3 className="h4">Do not write directly</h3>
                                            <p className="fs-sm">
                                                Please write and format your article offline before starting your submission.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="card border-0 bg-faded-danger mt-4">
                                        <div className="card-body">
                                            <i className="ai-telegram fs-2 text-danger d-block mb-3" />
                                            <h3 className="h4">Not Acceptable submissions</h3>

                                            <ul className="list-unstyled pb-3 mb-3 mb-lg-4">
                                                <li className="d-flex pt-2">
                                                    <i className="ai-check-alt fs-4 text-danger mt-n1 me-2" />
                                                    Surveys of medical students or residents
                                                </li>
                                                <li className="d-flex pt-2">
                                                    <i className="ai-check-alt fs-4 text-danger mt-n1 me-2" />
                                                    Articles on medical student, resident or physician burnout
                                                </li>
                                                <li className="d-flex pt-2">
                                                    <i className="ai-check-alt fs-4 text-danger mt-n1 me-2" />
                                                    Mini-reviews (Only comprehensive reviews will be considered.)
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12 col-xl-12 col-xxl-12 mt-5 text-center">
                            <div className="alert alert-success d-flex mb-4">
                                <i className="ai-circle-alert fs-xl me-2" />
                                <p className="mb-0">
                                    Thanks for choosing to publish with Journal of Healthcare sciences!
                                </p>
                            </div>

                            <div className="input-group align-center d-lg-inline-flex" style={{ maxWidth: 550 }}>
                                <span className="input-group-text text-muted">
                                    <i className="ai-file" />
                                </span>
                                <select className="form-select" list="datalist-options" id="datalist-input" {...register('type', { required: "Type by required", placeholder: "Select article type to get start" })}>
                                    {articleTypes?.map((articleType, index) => {
                                        return (
                                            <option key={"option"+index} >{articleType.name}</option>
                                        )
                                    })}
                                </select>
                                <div className="invalid-feedback">{errors.type?.message}</div>
                                <UpdateButton className='btn btn-primary' title="Getting Started" type='submit' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default GetStarted;