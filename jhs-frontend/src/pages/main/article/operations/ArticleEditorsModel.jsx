/* eslint-disable */
import React from 'react';

import { useSelector } from 'react-redux';

import Modal from '../../../../components/Modal';
import CreateButton from '../../../../components/button/Button';
import { useDispatch } from 'react-redux';
import { addEditorUserToArticle, assignArticleToAssignee, assignManagerToArticle, unassignUserFromArticle } from 'store/main/articleUser/actions';
import { useForm } from 'react-hook-form';
import { checkArticleManagerPermission } from 'helpers/globalHelpers';

const ArticleEditorsModel = ({ articleId }) => {

        const dispatch = useDispatch();
        const unassignUser = useSelector((state) => state.articleUser.singleUnassignUser);
        const editorList = useSelector((state) => state.article.singleEditorList);

        const {
                register,
                formState: { errors },
                handleSubmit,
        } = useForm({ reValidateMode: 'onChange' });
        
        const assignManagerHandler = (assignId) => {
                dispatch(
                        assignManagerToArticle({
                                body: { editorId: assignId },
                                options: { id: articleId, btnLoader: true, __module: 'article', showToast: true },
                        }));
        }
        
        const addEditorUserToArticleHandler = (formData) => {
                dispatch(
                        addEditorUserToArticle({
                                body: { editorId: formData.unassignEditor },
                                options: { id: articleId, btnLoader: true, __module: 'article', showToast: true },
                        }));
        }

        const assignArticleToAssigneeHandler = (assignId) => {
                dispatch(
                        assignArticleToAssignee({
                                body: { editorId: assignId },
                                options: { id: articleId, btnLoader: true, __module: 'article', showToast: true },
                        }));
        }

        const unassignHandler = (assignId) => {
                dispatch(
                        unassignUserFromArticle({
                                body: { editorId: assignId },
                                options: { id: articleId, btnLoader: true, __module: 'article', showToast: true },
                        }));
        }

        return (
                <Modal id={`showArticleEditorsModel`} className='modal-xl'>
                        <Modal.Header className="py-4">
                                <h3 className="fs-5 mb-0"> <i className="ai-user text-primary lead pe-1 me-2" /> Article Editor List</h3>
                        <button className="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close" />
                        </Modal.Header>
                        <Modal.Body>
                                <div className="card-body">
                                        {
                                                checkArticleManagerPermission('article-assign') ?
                                                        <form className='mb-4' onSubmit={handleSubmit(addEditorUserToArticleHandler)}>
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
                                                
                                                (editorList?.length !== 0 && editorList !== null) ?
                                                        <div className="table-responsive">
                                                                <table className="table table-hover">
                                                                        <thead>
                                                                                <tr>
                                                                                        <th>#</th>
                                                                                        <th>Name</th>
                                                                                        <th>Email</th>
                                                                                        <th>Phone</th>
                                                                                        <th>Occupation</th>
                                                                                        <th>Type</th>
                                                                                        <th width='15%'/>
                                                                                </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                                {
                                                                                        editorList.map((editor, index) => (
                                                                                                <tr key={`editor_list_${editor?._id ?? index}`}>
                                                                                                        <th scope="row">{index + 1}</th>
                                                                                                        <td>{editor.name}</td>
                                                                                                        <td>{editor.email}</td>
                                                                                                        <td>{editor.phone}</td>
                                                                                                        <td>{editor.occupation}</td>
                                                                                                        <td>{editor.isManager ? <>{ `Manager `}<i className="ai-circle-check-filled fs-base text-success ms-2"></i></> : editor.isAssignee ? <>{ `Assigned Editor`}<i className="ai-circle-check-filled fs-base text-success ms-2"></i></> : `Editor` }</td>
                                                                                                        <td>
                                                                                                                {
                                                                                                                       (checkArticleManagerPermission('article-assign')) && !editor.isManager  ?
                                                                                                                                <button
                                                                                                                                        key={`assignManager` + editor.id}
                                                                                                                                        id={`assignManager` + editor.id}
                                                                                                                                        className={`btn btn-outline-success btn-sm rounded-pill btn-icon mb-2 me-2`} onClick={() => assignManagerHandler(editor.id)}>
                                                                                                                                        <i className="ai-star"></i> 
                                                                                                                                </button>
                                                                                                                                : ''
                                                                                                                }
                                                                                                                {
                                                                                                                       (checkArticleManagerPermission('article-assign')) && !editor.isAssignee  ?
                                                                                                                                <button
                                                                                                                                        key={`assignArticleToEditor` + editor.id}
                                                                                                                                        id={`assignArticleToEditor` + editor.id}
                                                                                                                                        className={`btn btn-primary btn-sm btn-icon mb-2 me-2`} onClick={() => assignArticleToAssigneeHandler(editor.id)}>
                                                                                                                                        <i className="ai-user"></i> 
                                                                                                                                </button>
                                                                                                                                : ''
                                                                                                                }
                                                                                                                {
                                                                                                                        checkArticleManagerPermission('article-unassign') ?
                                                                                                                                <button
                                                                                                                                        key={`unassignUser` + editor.id}
                                                                                                                                        id={`unassignUser` + editor.id}
                                                                                                                                        className={`btn btn-secondary btn-sm btn-icon mb-2 me-2`} onClick={() => unassignHandler(editor.id)}>
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
                                                                        <h4 className="card-title">Not Editors are assigned Yet</h4>
                                                                        <p className="card-text">
                                                                                There were no editor are assigned to this article. You need to wait for it.
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

export default ArticleEditorsModel;