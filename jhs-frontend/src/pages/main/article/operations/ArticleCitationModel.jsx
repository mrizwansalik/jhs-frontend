/* eslint-disable */
import React from 'react';

import Modal from '../../../../components/Modal';
import CreateButton from '../../../../components/button/Button';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { exportCitation } from 'store/main/articles/actions';
import { useSelector } from 'react-redux';

const ArticleCitationModel = ({ articleId }) => {

        const dispatch = useDispatch();
        const articleInfo = useSelector((state) => state.article.single);

        const {
                register,
                formState: { errors },
                handleSubmit,
        } = useForm({ reValidateMode: 'onChange' });
        
        const getCitationHandler = (formData) => {
                dispatch(
                        exportCitation({
                                body: { type: formData.type },
                                options: { id: articleId, btnLoader: true, __module: 'article', showToast: true },
                        }));
        }

        return (
                <Modal id={`showArticleCitationModel`}>
                        <Modal.Header className="py-4">
                                <h3 className="fs-5 mb-0"> <i className="ai-file-text text-primary lead pe-1 me-2" />Article Citation</h3>
                        <button className="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close" />
                        </Modal.Header>
                        <Modal.Body className="pb-2">
                                <div className="card-body">
                                        {
                                                <form className='mb-4' onSubmit={handleSubmit(getCitationHandler)}>

                                                        <h3 className="h5 mb-1">{articleInfo?.title}</h3>
                                                        <p className="fs-sm text-muted mb-0">{articleInfo?._author?.email } {}</p>

                                                        <div className="input-group align-center d-lg-inline-flex mt-5" style={{ maxWidth: 550 }}>
                                                                <span className="input-group-text text-muted">
                                                                        <i className="ai-file-text" />
                                                                </span>
                                                                <select className="form-select" list="datalist-options" id="datalist-input" 
                                                                        {...register('type', { required: "Citation is required", placeholder: "Select Citation" })}>
                                                                                <option key={`citation enw ${articleId}`} value={`enw`} >{`.enw (EndNote)`}</option>
                                                                                <option key={`citation ris ${articleId}`} value={`ris`} >{`.ris  (Mendeley, Papers, Zotero)`}</option>
                                                                                <option key={`citation bibtex ${articleId}`} value={`bibtex`} >{`.bibtex (BibTex)`}</option>
                                                                                <option key={`citation refworks ${articleId}`} value={`refworks`} >{`.txt (Medlars, Refworks)`}</option>
                                                                </select>
                                                                <div className="invalid-feedback">{errors.type?.message}</div>
                                                                <CreateButton className='btn btn-primary mr-2' title="Export Citation" type='submit' />
                                                        </div>
                                                </form>
                                        }
                                </div>
                        </Modal.Body>
                </Modal>
        );
};

export default ArticleCitationModel;