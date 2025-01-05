/* eslint-disable */
import React, { useEffect } from 'react';

import Modal from '../../../../components/Modal';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { addArticleComment } from 'store/main/articles/actions';
import { getArticleUserInfo, getArticleUserTitle } from 'helpers/globalHelpers';

const AddCommentModel = ({articleId, selectedCategory,selectedText, onSuccess}) => {

        const dispatch = useDispatch();
        const user = useSelector((state) => state.profile.profile);

        const {
                register,
                formState: { errors },
                handleSubmit,
                reset,
        } = useForm({ reValidateMode: 'onChange' });
        
        const addCommentHandler = async (formData) => {
                formData.highlight = selectedText
                let commentUserTitle = getArticleUserTitle(user?._id)
                const data = {
                        ...formData,
                        ...selectedCategory,
                        "userType": commentUserTitle
                }
                const response = await dispatch(addArticleComment({body: data, options: { id: articleId, btnLoader: true, __module: 'articleProcessing', showToast: true }}))
                //dispatch(send(socketSession, 'SET_ARTICLE_SESSION', { ...data }));
                reset();
                if(response.status === 200){
                        let commentUserInfo = getArticleUserInfo(response.data.addBy);
                        onSuccess(response.data.highlight, response.data._id, response.data.text, selectedCategory.startOffset, selectedCategory.endOffset, response.data.forArea, commentUserInfo );
                }
                
        }

        return (
                <Modal id={`addCommentModel`}>
                        <Modal.Header className="py-4">
                                <h3 className="fs-5 mb-0"> <i className="ai-comment text-primary lead pe-1 me-2" /> Add Comment on Article</h3>
                        <button className="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close" />
                        </Modal.Header>
                        <Modal.Body>
                                <div className="card-body">
                                        <form id={`addComment${articleId}`} onSubmit={handleSubmit(addCommentHandler)}>
                                                <div className="row g-3 g-sm-4 mb-3">
                                                        {/* <div className="col-12">
                                                                <label className="form-label" htmlFor="highlight">Highlight</label>
                                                                <input disabled className={`form-control`}  
                                                                {...register('highlight',{ 
                                                                                        placeholder: "Comment Text" 
                                                                                }
                                                                 )}
                                                                type="text" id="highlight" value={selectedText} ></input>
                                                                <div className="invalid-feedback"></div>
                                                        </div> */}
                                                        <div className="col-12">
                                                                <label className="form-label" htmlFor="text">Comment Text</label>
                                                                <textarea
                                                                className="form-control"
                                                                {...register('text',{ 
                                                                                        required: "Citation is required", 
                                                                                        placeholder: "Comment Text" 
                                                                                }
                                                                )}
                                                                id="text"
                                                                rows={5}
                                                                />
                                                        </div>
                                                </div>
                                        </form>
                                </div>
                        </Modal.Body>
                        <Modal.Footer>
                                <button type="submit" form={`addComment${articleId}`} className="btn btn-primary w-100 w-sm-auto mb-3 mb-sm-0" data-bs-dismiss="modal">Add Comment</button>
                        </Modal.Footer>
                </Modal>
        );
};

export default AddCommentModel;