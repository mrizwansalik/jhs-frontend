/* eslint-disable */
import React from 'react';

import { useSelector } from 'react-redux';

import Modal from '../../../../components/Modal';
import { assignReviewerToArticle, unassignReviewerFromArticle } from 'store/main/articleUser/actions';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { checkArticleManagerPermission } from 'helpers/globalHelpers';
import CreateButton from '../../../../components/button/Button';

const ArticleReviewerModel = ({ articleId }) => {

        const dispatch = useDispatch();
        const unassignUser = useSelector((state) => state.articleUser.singleUnassignUser);
        const reviewerList = useSelector((state) => state.article.singleReviewerList);

        const {
                register,
                formState: { errors },
                handleSubmit,
        } = useForm({ reValidateMode: 'onChange' });

        const assignHandler = (formData) => {
                dispatch(assignReviewerToArticle({
                                body: { editorId: formData.unassignEditor },
                                options: { id: articleId, btnLoader: true, __module: 'article', showToast: true },
                        }));
        }

        const unassignHandler = (assignId) => {
                dispatch(
                        unassignReviewerFromArticle({
                                body: { editorId: assignId },
                                options: { id: articleId, btnLoader: true, __module: 'article', showToast: true },
                        }));
        }
        return (
                <Modal id={`showArticleReviewerModel`}>
                        <Modal.Header className="py-4">
                                <h3 className="fs-5 mb-0"> <i className="ai-user text-primary lead pe-1 me-2" /> Article Reviewer List</h3>
                        <button className="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close" />
                        </Modal.Header>
                        <Modal.Body>
                                <div className="card-body">
                                        {
                                                checkArticleManagerPermission('article-assign') ?
                                                        <form className='mb-4' onSubmit={handleSubmit(assignHandler)}>
                                                                <div className="input-group align-center d-lg-inline-flex" style={{ maxWidth: 550 }}>
                                                                        <span className="input-group-text text-muted">
                                                                                <i className="ai-user" />
                                                                        </span>
                                                                        <select className="form-select" list="datalist-options" id="datalist-input" {...register('unassignEditor', { required: "Editor is required", placeholder: "Select Editor" })}>
                                                                                {unassignUser?.map((user, index) => {
                                                                                        return (
                                                                                                <option key={"option" + index} value={user.id} >{`${user.name} (${user.email})`}</option>
                                                                                        )
                                                                                })}
                                                                        </select>
                                                                        <div className="invalid-feedback">{errors.type?.message}</div>
                                                                        <CreateButton className='btn btn-primary' title="Assign User" type='submit' />
                                                                </div>
                                                        </form>
                                                        : ''
                                        }
                                        {
                                                (reviewerList?.length !== 0 && reviewerList !== null) ?
                                                        <div className="table-responsive">
                                                                <table className="table table-hover">
                                                                        <thead>
                                                                                <tr>
                                                                                        <th>#</th>
                                                                                        <th>Name</th>
                                                                                        <th>Email</th>
                                                                                        <th>Phone</th>
                                                                                        <th>Occupation</th>
                                                                                        <th></th>
                                                                                </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                                {
                                                                                        reviewerList.map((reviewer, index) => (
                                                                                                <tr key={`reviewer_list_${index}`}>
                                                                                                        <th scope="row">{index+1}</th>
                                                                                                        <td>{reviewer.name}</td>
                                                                                                        <td>{reviewer.email}</td>
                                                                                                        <td>{reviewer.phone}</td>
                                                                                                        <td>{reviewer.occupation}</td>
                                                                                                        <td>
                                                                                                                {
                                                                                                                        checkArticleManagerPermission('article-unassign') ?
                                                                                                                                <button
                                                                                                                                        key={`unassignReviewer` + reviewer.id}
                                                                                                                                        id={`unassignReviewer` + reviewer.id}
                                                                                                                                        className={`btn btn-secondary btn-sm btn-icon mb-2 me-2`} onClick={() => unassignHandler(reviewer.id)}>
                                                                                                                                        <i className="ai-trash"></i>
                                                                                                                                </button>
                                                                                                                                : ''
                                                                                                                }
                                                                                                        </td>
                                                                                                </tr>
                                                                                        ))

                                                                                }

                                                                        </tbody>
                                                                </table>
                                                        </div>
                                                        :
                                                        <div
                                                                className="card border-0 bg-secondary mx-auto"
                                                        >
                                                                <div className="card-body">
                                                                        <h4 className="card-title">Not Reviewers are assigned Yet</h4>
                                                                        <p className="card-text">
                                                                                There were no reviewer are assigned to this article. You need to wait for it.
                                                                        </p>
                                                                </div>
                                                        </div>
                                        }

                                </div>
                        </Modal.Body>
                        <Modal.Footer>
                                <button type="button" className="btn btn-secondary w-100 w-sm-auto mb-3 mb-sm-0" data-bs-dismiss="modal">Close</button>
                        </Modal.Footer>
                </Modal>
        );
};

export default ArticleReviewerModel;