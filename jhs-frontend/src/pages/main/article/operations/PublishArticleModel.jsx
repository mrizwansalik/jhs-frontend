/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import Model from '../../../../components/Modal';

import { setToast, setUpToast, toggleModal } from 'helpers/globalHelpers';

import { Button } from 'reactstrap';
import DropzoneFile from 'components/Dropzone/DropzoneFile';
import { config as mainConfig } from '../../../../config/config';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { setFormErrors } from 'store/form/actions';
import { useDispatch } from 'react-redux';

const PublishArticleModel = () => {

        const articleInfo = useSelector((state) => state.article.single);
        const dispatch = useDispatch();

        const [uploadFile, setUploadFile] = useState({ preview: "", raw: "" });

        const {
                register,
                formState: { errors },
                handleSubmit,
                reset,
        } = useForm({ reValidateMode: 'onChange' });

        const publishArticleHandle = async (formData) => {
                const appendForm = new FormData();
                appendForm.append("file", uploadFile.raw);
                appendForm.append("title", formData.pages);
                appendForm.append("data", uploadFile);

                try {
                        axios.post(import.meta.env.VITE_REACT_APP_API_URL + `articleProcessing/${articleInfo?._id}/publishArticle`, appendForm, {
                                headers: {
                                        'Content-Type': 'multipart/form-data',
                                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                                        ...mainConfig.data().defaultHeaders,
                                }
                        })
                        .then(response => {
                                dispatch({ type: 'PUBLISH_ARTICLE', payload: response.data });
                                setToast(setUpToast(response));
                        })
                        .catch(error => {
                                setFormErrors(error.response.data);
                        });
                } catch (e) {
                        setFormErrors(e);
                }
                toggleModal('#showPublishArticleModel');
        }

        const handleToggle = () => {
                const myModalEl = document.querySelector('#showPublishArticleModel');
                const modal = window.bootstrap.Modal.getOrCreateInstance(myModalEl);

                modal.hide();
        }

        const handlePDF = (file) => {
                if (file.length) {
                        setUploadFile({
                                preview: URL.createObjectURL(file[0]),
                                raw: file[0]
                        });
                }
        }

        return (
                <Model id='showPublishArticleModel'>
                        <Model.Header>
                                <h4 className="modal-title">Add Article Detail to Publish Article</h4>
                                <button className="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close" onClick={handleToggle}></button>
                        </Model.Header>
                        <Model.Body>
                                <form onSubmit={handleSubmit(publishArticleHandle)} id="file_model">
                                        <div className="row g-3 g-sm-4">
                                                <div className="col-sm-12">
                                                        <div className="text-center text-lg-start">
                                                                <div className="pb-3">
                                                                        <label className="form-label" htmlFor="pages">Pages</label>
                                                                        <div className="input-group">
                                                                                <input className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                                                                        {...register('pages', {
                                                                                                required: 'Pages title is required',
                                                                                        })} type="text" id="pages"
                                                                                        placeholder="Enter your pages here" />
                                                                                <div className="invalid-feedback">{errors.title?.message}</div>
                                                                        </div>
                                                                </div>
                                                                <div className="pb-3">
                                                                        <label className="form-label" htmlFor="pdf">PDF</label>
                                                                        <DropzoneFile handlePDF={handlePDF} />
                                                                        <div className="invalid-feedback">{errors.title?.message}</div>
                                                                </div>
                                                        </div>
                                                </div>
                                        </div>
                                </form>
                        </Model.Body>
                        <Model.Footer>
                                <Button className="btn btn-secondary" type="button" data-bs-dismiss="modal" onClick={handleToggle}>Cancel</Button>
                                <button className='btn btn-primary ms-3' form="file_model" title="Add Figure" type='submit' >Publish Article</button>
                        </Model.Footer>
                </Model>
        );
};

export default PublishArticleModel;