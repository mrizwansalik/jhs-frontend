/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Container, DropdownItem, Col, Row } from 'reactstrap';

import Modal from '../../../../components/Modal';
import { toggleModal } from '../../../../helpers/globalHelpers'

import { updateDraftArticle } from '../../../../store/main/articles/actions'
import { searchAuthor, assignAuthor, unAssignAuthor, addPublicUser } from '../../../../store/main/author/actions';

import ReOrderableGrid from '../../../../components/DndKit/ReOrderableGrid';
import ReOrderableItem from '../../../../components/DndKit/ReOrderableItem';

import '../../../../components/DndKit/style.css';

const initial = {
    email: null,
    initialLoad: false,
    isUserAdded: false
}
const Authors = () => {
    const dispatch = useDispatch();
    let { articleId } = useParams();
    const navigate = useNavigate();
    const articleInfo = useSelector((state) => state.article.singleDraft);
    const selectedArticleType = useSelector((state) => state.articleType.selected);

    const searchedAuthor = useSelector((state) => state.author.search);
    const publicUser = useSelector((state) => state.author.publicUser);
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
        if (articleInfo?.authorList?.length) {
            articleInfo?.authorList?.map((item) => {
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
        if (searchedAuthor?.email) toggleModal('#FoundUser');
        if (!searchedAuthor?.email && searchedAuthor !== null) toggleModal('#NotFound');
    }, [searchedAuthor]);

    useEffect(() => {
        if (publicUser?._id && state.isUserAdded) {
            dispatch(
                assignAuthor({
                    body: { authorList: [{ _id: publicUser._id }] },
                    options: { id: articleId, btnLoader: true, __module: 'article', showToast: true },
                }));
        }
    }, [publicUser])


    const updateDraftArticleHandle = (formData) => {
        const data = items.map((item) => {
            return item._id
        });
        dispatch(
            updateDraftArticle({
                body: { authorList: data },
                options: { id: articleId, btnLoader: true, __module: 'article', showToast: true },
            }));
        navigate(`/main/article/${articleId}/edit/${selectedArticleType?.elements[0]}`);
    }

    const searchAuthorArticleHandle = () => {
        dispatch({ type: 'SET_SEARCH_AUTHOR_INFORMATION', payload: null });
        dispatch(
            searchAuthor({
                body: { email: state.email },
                options: { loader: true, __module: 'author', showToast: false },
            }));
    }

    //------ if user found then assign to article ------ //
    const assignAuthorToArticle = () => {
        dispatch(
            assignAuthor({
                body: { authorList: [{ _id: searchedAuthor._id }] },
                options: { id: articleId, btnLoader: true, __module: 'article', showToast: true },
            }));
        toggleModal('#FoundUser');
    }

    const unAssignAuthorFromArticle = (authorId) => {
        dispatch(
            unAssignAuthor({
                body: { authorList: [{ _id: authorId }] },
                options: { id: articleId, btnLoader: true, __module: 'article', showToast: true },
            }));
    }

    const addUser = (formData) => {
        dispatch(
            addPublicUser({
                body: { ...formData },
                options: { loader: true, __module: 'author', showToast: true },
            }));
        setState({ ...state, isUserAdded: true });
        toggleModal('#NotFound');
    }

    if (!articleInfo || !items) {
        return "Loading...";
    }

    return (
        <div className="col-lg-9">
            <section className="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
                <div className="card-body">
                    <div className="row g-3 g-sm-4">
                        <div className="col-sm-12">
                            <div className="text-center text-lg-start ">
                                <h3 className="h3 mb-4">
                                    It's time to add the authors.
                                </h3>
                                <p className="pb-2 mb-2">
                                    Copy and paste your authors below. Only original articles may include sub headers. The authors is limited to 3,500 characters.
                                </p>

                                <div className="input-group align-center d-lg-inline-flex" style={{ maxWidth: 400 }}>

                                    <span className="input-group-text text-muted">
                                        <i className="ai-mail" />
                                    </span>
                                    <input onKeyUp={(e) => setState({ ...state, email: e.target.value })} className="form-control" list="datalist-options" id="datalist-input" />
                                    <div className="invalid-feedback">{errors.type?.message}</div>
                                    <button onClick={searchAuthorArticleHandle} className='btn btn-primary'>Search</button>
                                </div>
                                <div className="pb-3 mt-5">
                                    <Row>
                                        <Col>
                                            <ReOrderableGrid
                                                id="broken"
                                                items={items}
                                                onReorder={newItems => setItems(newItems)}
                                            >
                                                {items?.map((item) => (
                                                    <ReOrderableItem
                                                        id={item?._id}
                                                        key={item?._id}
                                                        menu={[
                                                            <DropdownItem key={"unassignAuthor" + item?._id} onClick={() => unAssignAuthorFromArticle(item?._id)}>UnAssign</DropdownItem>,
                                                        ]}
                                                    >
                                                        <li className="d-md-flex align-items-center">
                                                            <div className="d-sm-flex align-items-center">
                                                                <div className="rounded-circle bg-size-cover bg-position-center flex-shrink-0"
                                                                    style={{
                                                                        width: 50,
                                                                        height: 50,
                                                                        backgroundImage: "url(/assets/img/avatar/user.png)"
                                                                    }}
                                                                />
                                                                <div className="pt-3 pt-sm-0 ps-sm-3">
                                                                    <h4 className="h6 mb-1">
                                                                        {item?.full_name ? item.full_name : "No name"}
                                                                        <i className="ai-circle-check-filled fs-base text-success ms-2" />
                                                                    </h4>
                                                                    <div className="text-muted fw-small d-flex flex-wrap flex-sm-nowrap align-items-center">
                                                                        <div className="d-flex align-items-center me-3">
                                                                            <i className="ai-mail me-1" />
                                                                            {item?.email}
                                                                        </div>
                                                                        <div className="d-flex align-items-center text-nowrap">
                                                                            <i className="ai-map-pin me-1" />
                                                                            {item?.occupation}, {item?.institute}, {item?.country}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </ReOrderableItem>
                                                ))}
                                            </ReOrderableGrid>
                                        </Col>
                                    </Row>
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
                    <h3 className="fs-5 mb-0"> <i className="ai-user text-primary lead pe-1 me-2" /> Author Details</h3>
                    <button
                        className="btn-close"
                        type="button"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    />

                </Modal.Header>
                <Modal.Body>
                    <div className="card-body">
                        <div className="d-md-flex align-items-center">
                            <div className="d-sm-flex align-items-center">
                                <div className="rounded-circle bg-size-cover bg-position-center flex-shrink-0" style={{ width: '80px', height: '80px', backgroundImage: 'url(/assets/img/avatar/user.png)' }} />
                                <div className="pt-3 pt-sm-0 ps-sm-3">
                                    <h3 className="h5 mb-2">{searchedAuthor?.full_name ? searchedAuthor.full_name : 'No Name'}<i className="ai-circle-check-filled fs-base text-success ms-2" /></h3>
                                    <div className="text-muted fw-medium d-flex flex-wrap flex-sm-nowrap align-items-center">
                                        <div className="d-flex align-items-center me-3"><i className="ai-mail me-1" />{searchedAuthor?.email}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-100 pt-3 pt-md-0 ms-md-auto" style={{ maxWidth: '300px', minWidth: '300px' }}>
                                <table className="table mb-0">
                                    <tbody>
                                        <tr>
                                            <td className="border-0 text-muted py-1 px-0">Occupation</td>
                                            <td className="border-0 text-dark fw-medium py-1 ps-3">{searchedAuthor?.occupation}</td>
                                        </tr>
                                        <tr>
                                            <td className="border-0 text-muted py-1 px-0">Institute</td>
                                            <td className="border-0 text-dark fw-medium py-1 ps-3">{searchedAuthor?.institute}</td>
                                        </tr>
                                        <tr>
                                            <td className="border-0 text-muted py-1 px-0">Country</td>
                                            <td className="border-0 text-dark fw-medium py-1 ps-3">{searchedAuthor?.country}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-secondary w-100 w-sm-auto mb-3 mb-sm-0" data-bs-dismiss="modal">Close</button>
                    <button onClick={assignAuthorToArticle} type="button" className="btn btn-primary w-100 w-sm-auto ms-sm-3">Assign Author</button>
                </Modal.Footer>
            </Modal>

            <form onSubmit={handleSubmit(addUser)}>
                <Modal id="NotFound">
                    <Modal.Header className="py-4">
                        <h3 className="fs-5 mb-0">Add New User</h3>
                        <button className="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close" />
                    </Modal.Header>
                    <Modal.Body>
                        <div className="row g-3 g-sm-4 mt-0 mt-lg-2">
                            <div className="col-sm-6">
                                <label className="form-label" htmlFor="fn">First name</label>
                                <input placeholder='First Name...' className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                                    {...register('first_name', {
                                        required: 'First name is required',
                                    })} type="text" id="fn" />
                                <div className="invalid-feedback">{errors.first_name?.message}</div>
                            </div>
                            <div className="col-sm-6">
                                <label className="form-label" htmlFor="ln">Last name</label>
                                <input placeholder='Last Name...' className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
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
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-secondary w-100 w-sm-auto mb-3 mb-sm-0" data-bs-dismiss="modal">Close</button>
                        <button type="submit" className="btn btn-primary w-100 w-sm-auto ms-sm-3">Assign Author</button>
                    </Modal.Footer>

                </Modal>
            </form>
        </div>
    );
};

export default Authors;