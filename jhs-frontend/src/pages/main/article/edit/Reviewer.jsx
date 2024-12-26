/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { updateDraftArticle } from '../../../../store/main/articles/actions'
import { searchReviewer, suggestReviewer, unSuggestReviewer, addPublicUser } from '../../../../store/main/reviewer/actions';
import Modal from '../../../../components/Modal';
import { toggleModal } from '../../../../helpers/globalHelpers'

import '../../../../components/DndKit/style.css';

const initial = {
    email: null,
    initialLoad: false,
    isUserAdded: false
}
const Reviewers = () => {
    const dispatch = useDispatch();
    let { articleId } = useParams();
    const navigate = useNavigate();
    const articleInfo = useSelector((state) => state.article.singleDraft);

    const searchedReviewer = useSelector((state) => state.reviewer.search);
    const publicUser = useSelector((state) => state.reviewer.publicUser);
    const [state, setState] = useState(initial);
    const [items, setItems] = useState([]);
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm({ reValidateMode: 'onChange' });

    useEffect(() => {
        reset();
        const arr = [];
        if (articleInfo?.suggestedReviewerList?.length) {
            articleInfo?.suggestedReviewerList?.map((item) => {
                arr.push({ id: item._id, ...item })
            });
        }
        setItems(arr);
    }, [articleInfo]);

    useEffect(() => {
        setState({ ...state, initialLoad: true });
        //dispatch(getPublicDepartments({ body: {}, options: { __module: 'department' } }));
    }, []);

    useEffect(() => {
        if (searchedReviewer?.email) toggleModal('#FoundUser');
        if (!searchedReviewer?.email && searchedReviewer !== null) toggleModal('#NotFound');
    }, [searchedReviewer]);

    useEffect(() => {
        if (publicUser?._id && state.isUserAdded) {
            dispatch(suggestReviewer({ body: { reviewerList: [{ _id: publicUser._id }] }, options: { id: articleId, btnLoader: true, __module: 'article', showToast: true } }));
        } // end if
    }, [publicUser])


    const updateDraftArticleHandle = (formData) => {
        const data = items.map((item) => {
            return item._id
        });
        dispatch(updateDraftArticle({ body: { suggestedReviewerList: data }, options: { id: articleId, btnLoader: true, __module: 'article', showToast: true } }));

        navigate(`/main/article/${articleId}/edit/summary`);
    }

    const searchReviewerArticleHandle = () => {
        dispatch({ type: 'SET_SEARCH_REVIEWER_INFORMATION', payload: null });
        dispatch(searchReviewer({ body: { email: state.email }, options: { loader: true, __module: 'author', showToast: false } }));
    }

    //------ if user found then suggest to article ------ //
    const suggestReviewerToArticle = () => {
        dispatch(suggestReviewer({ body: { reviewer: [{ _id: searchedReviewer._id }] }, options: { id: articleId, btnLoader: true, __module: 'article', showToast: true } }));
        toggleModal('#FoundUser');
    }

    const unSuggestReviewerFromArticle = (reviewerId) => {
        dispatch(unSuggestReviewer({ body: { reviewer: [{ _id: reviewerId }] }, options: { id: articleId, btnLoader: true, __module: 'article', showToast: true } }));
    }

    const addUser = (formData) => {
        dispatch(addPublicUser({ body: { ...formData }, options: { loader: true, __module: 'reviewer', showToast: true }, }));
        setState({ ...state, isUserAdded: true });
        toggleModal('#NotFound');
    }

    if (!articleInfo) {
        return "Loading...";
    }

    return (
        <div className="col-lg-9">
            {/* Journals list */}
            <section className="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
                <div className="card-body">
                    <div className="row g-3 g-sm-4">
                        <div className="col-sm-12">
                            <div className="text-center text-lg-start ">
                                <h3 className="h3 mb-4">
                                    It's a peer review party! Who will you invite?
                                </h3>
                                <p className="pb-2 mb-2">There’s no cake, but we can still celebrate (and improve) your hard work. Search for an email address below to see if the reviewer you’d like to invite already has a Cureus account. If not, you’ll be prompted to enter their basic information. If your article is approved for peer review, each reviewer will receive an email invitation to review (and register if they haven’t already).</p>
                                <div className="input-group align-center d-lg-inline-flex" style={{ maxWidth: 400 }}>
                                    <span className="input-group-text text-muted">
                                        <i className="ai-mail" />
                                    </span>
                                    <input onKeyUp={(e) => setState({ ...state, email: e.target.value })} className="form-control" list="datalist-options" id="datalist-input" />
                                    <div className="invalid-feedback">{errors.type?.message}</div>
                                    <button onClick={searchReviewerArticleHandle} className='btn btn-primary'>Search</button>
                                </div>
                                <div className="pb-3 mt-5">
                                    {/* Basic table */}
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>Occupation</th>
                                                    <th>Institute</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    items?.map((item, index) => (
                                                        <tr key={"reviewerRow" + item?._id}>
                                                            <th scope="row">{++index}</th>
                                                            <td>{item?.full_name ? item.full_name : "No name"}</td>
                                                            <td>{item?.email}</td>
                                                            <td>{item?.occupation}</td>
                                                            <td>{item?.institute}, {item?.country}</td>
                                                            <td>
                                                                <Link
                                                                    key={"reviewerLinkSuggest" + item?._id}
                                                                    className="nav-link text-primary fs-xl fw-normal py-1 pe-0 ps-1 ms-2"
                                                                    onClick={() => { unSuggestReviewerFromArticle(item?._id) }}
                                                                >
                                                                    <i className="ai-trash" />
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 d-flex justify-content-end pt-3">
                                <Link className="btn btn-secondary" to='/main/dashboard/article/draft'>Cancel</Link>
                            <button className='btn btn-primary ms-3' type='button' onClick={updateDraftArticleHandle}>Save & Continue</button>
                        </div>
                    </div>
                </div>
            </section>

            <Modal id="FoundUser">
                <Modal.Header className="py-4">
                    {/* <h3 className="fs-5 mb-0">Are you sure?</h3> */}
                        <button className="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close" />
                </Modal.Header>
                <Modal.Body>
                    <div className="card-body">
                        <div className="d-flex align-items-center mt-sm-n1 pb-4 mb-0 mb-lg-1 mb-xl-3"><i className="ai-user text-primary lead pe-1 me-2" />
                            <h2 className="h4 mb-0">Reviewer Details</h2>
                            {/* <Link to='/system/settings' className="btn btn-sm btn-secondary ms-auto">  <i className="ai-edit ms-n1 me-2" />Edit info</Link> */}
                        </div>
                        <div className="d-md-flex align-items-center">
                            <div className="d-sm-flex align-items-center">
                                <div className="rounded-circle bg-size-cover bg-position-center flex-shrink-0" style={{ width: '80px', height: '80px', backgroundImage: 'url(/assets/img/avatar/user.png)' }} />
                                <div className="pt-3 pt-sm-0 ps-sm-3">
                                    <h3 className="h5 mb-2">{searchedReviewer?.full_name ? searchedReviewer.full_name : 'No Name'}<i className="ai-circle-check-filled fs-base text-success ms-2" /></h3>
                                    <div className="text-muted fw-medium d-flex flex-wrap flex-sm-nowrap align-items-center">
                                        <div className="d-flex align-items-center me-3"><i className="ai-mail me-1" />{searchedReviewer?.email}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-100 pt-3 pt-md-0 ms-md-auto" style={{ maxWidth: '212px' }}>
                                <div className="d-flex justify-content-between fs-sm pb-1 mb-2">Profile completion<strong className="ms-2">62%</strong></div>
                                <div className="progress" style={{ height: '5px' }}>
                                    <div className="progress-bar" role="progressbar" style={{ width: '62%' }} aria-valuenow={62} aria-valuemin={0} aria-valuemax={100} />
                                </div>
                            </div>
                        </div>
                        <div className="row py-4 mb-2 mb-sm-3">
                            <div className="col-md-6 mb-4 mb-md-0">
                                <table className="table mb-0">
                                    <tbody>
                                        <tr>
                                            <td className="border-0 text-muted py-1 px-0">Language</td>
                                            <td className="border-0 text-dark fw-medium py-1 ps-3">{searchedReviewer?.language}</td>
                                        </tr>
                                        <tr>
                                            <td className="border-0 text-muted py-1 px-0">Position</td>
                                            <td className="border-0 text-dark fw-medium py-1 ps-3">{searchedReviewer?.position}</td>
                                        </tr>
                                        <tr>
                                            <td className="border-0 text-muted py-1 px-0">Role</td>
                                            <td className="border-0 text-dark fw-medium py-1 ps-3">{searchedReviewer?.role}</td>
                                        </tr>
                                    </tbody></table>
                            </div>
                            <div className="col-md-6 d-md-flex justify-content-end">
                                <div className="w-100 border rounded-3 p-4" style={{ maxWidth: '212px' }}><img className="d-block mb-2" src="/assets/img/account/gift-icon.svg" width={24} alt="Gift icon" />
                                    <h4 className="h5 lh-base mb-0">123 bonuses</h4>
                                    <p className="fs-sm text-muted mb-0">1 bonus $1</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-secondary w-100 w-sm-auto mb-3 mb-sm-0" data-bs-dismiss="modal">Close</button>
                    <button onClick={suggestReviewerToArticle} type="button" className="btn btn-primary w-100 w-sm-auto ms-sm-3">Save changes</button>
                </Modal.Footer>
            </Modal>

            <form onSubmit={handleSubmit(addUser)}>
                <Modal id="NotFound">

                    <Modal.Header className="py-4">
                        <h4 className="fs-5 mb-0">Add New User</h4>
                        <button
  className="btn-close"
  type="button"
  data-bs-dismiss="modal"
  aria-label="Close"
/>
                    </Modal.Header>
                    <Modal.Body>

                        <div className="row g-3 g-sm-4 mt-0 mt-lg-2">
                            <div className="col-sm-6">
                                <label className="form-label" htmlFor="fn">First name</label>
                                <input placeholder='Firstname...' className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                                    {...register('first_name', {
                                        required: 'First name is required',
                                    })} type="text" id="fn" />
                                <div className="invalid-feedback">{errors.first_name?.message}</div>
                            </div>
                            <div className="col-sm-6">
                                <label className="form-label" htmlFor="ln">Last name</label>
                                <input placeholder='Lastname...' className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                                    {...register('last_name', {
                                        required: 'Last name is required',
                                    })} type="text" id="ln" />
                                <div className="invalid-feedback">{errors.last_name?.message}</div>
                            </div>
                            <div className="col-sm-6">
                                <label className="form-label" htmlFor="email">Email</label>
                                <input placeholder='Email...' className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    {...register('email', {
                                        required: "Email is required"
                                    })}
                                    type="text" id="email" />
                                <div className="invalid-feedback">{errors.email?.message}</div>
                            </div>
                            <div className="col-sm-6">
                                <label className="form-label" htmlFor="phone">Department <span className="text-muted">(optional)</span></label>
                                <input placeholder='Department...' className={`form-control ${errors.department ? 'is-invalid' : ''}`}
                                    {...register('department', {})}
                                    type="text" id="phone" />
                                <div className="invalid-feedback">{errors.department?.message}</div>
                            </div>
                            <div className="col-sm-12">
                                <label className="form-label" htmlFor="occupation">Occupation <span className="text-muted"></span></label>
                                <input placeholder='Occupation...' className={`form-control ${errors.occupation ? 'is-invalid' : ''}`}
                                    {...register('occupation', {})}
                                    type="text" id="occupation" />
                                <div className="invalid-feedback">{errors.occupation?.message}</div>
                            </div>
                            <div className="col-12 d-sm-flex align-items-center pt-sm-2 pt-md-3">
                                <div className="form-label text-muted mb-2 mb-sm-0 me-sm-4">Gender:</div>
                                <div className="form-check form-check-inline mb-0">
                                    <input className="form-check-input"  {...register("gender")} type="radio" value="Male" name="gender" id="male" />
                                    <label className="form-check-label" htmlFor="male">Male</label>
                                </div>
                                <div className="form-check form-check-inline mb-0">
                                    <input className="form-check-input" {...register("gender")} value="Female" type="radio" name="gender" defaultChecked id="female" />
                                    <label className="form-check-label" htmlFor="female">Female</label>
                                </div>
                                <div className="form-check form-check-inline mb-0">
                                    <input className="form-check-input" type="radio" {...register("gender")} value="Other" name="gender" id="other" />
                                    <label className="form-check-label" htmlFor="other">Other</label>
                                </div>
                            </div>

                        </div>
                        {/* <button type="button" className="btn btn-secondary w-100 w-sm-auto mt-6  mb-sm-0" data-bs-dismiss="modal">Close</button>
                    <button type="submit" className="btn btn-primary w-100 w-sm-auto ms-sm-3">Save changes</button> */}


                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-secondary w-100 w-sm-auto mb-3 mb-sm-0" data-bs-dismiss="modal">Close</button>
                        <button type="submit" className="btn btn-primary w-100 w-sm-auto ms-sm-3">Save changes</button>
                    </Modal.Footer>

                </Modal>
            </form>
        </div>
    );
};

export default Reviewers;