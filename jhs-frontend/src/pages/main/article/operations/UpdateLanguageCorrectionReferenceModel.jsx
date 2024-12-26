/* eslint-disable */
import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';

import { updateReference } from 'store/main/reference/actions';
import { useForm } from 'react-hook-form';

import Modal from '../../../../components/Modal';
import UpdateButton from '../../../../components/button/Button';
import { useDispatch } from 'react-redux';
import { toggleModal } from 'helpers/globalHelpers';
import { updateLanguageCorrectionReference } from 'store/main/articlesLanguageCorrectionReference/actions';

const UpdateLanguageCorrectionReferenceModel = ({ articleId }) => {

        const dispatch = useDispatch();
        const [reference, setReference] = useState('');
        const selectedReference = useSelector((state) => state.articleLanguageCorrection.selectedReference);

        const {
                register,
                formState: { errors },
                handleSubmit,
                reset,
        } = useForm({ reValidateMode: 'onChange' });

        useEffect(() => {
                reset();
                setReference(selectedReference?.type)
        }, [selectedReference]);

        const updateReferenceHandle = (formData) => {
                let data;
                switch (formData.type) {
                        case 'book':
                                data = {
                                        authors: formData.authors,
                                        type: "book",
                                        title: formData.title,
                                        editor: formData.editor,
                                        publisher: formData.publisher,
                                        publishLocation: formData.publishLocation,
                                        year: formData.year,
                                        doi: formData.doi,
                                        original_text: formData.original_text,
                                }
                                break;
                        case "journal":
                                data = {
                                        authors: formData.authors,
                                        type: "journal",
                                        title: formData.title,
                                        journal: formData.journal,
                                        year: formData.year,
                                        pages: formData.pages,
                                        volume: formData.volume,
                                        issue: formData.issue,
                                        doi: formData.doi,
                                        url: formData.url,
                                        original_text: formData.original_text,
                                }
                                break;
                        case 'website':
                                data = {
                                        title: formData.title,
                                        type: "website",
                                        year: formData.year,
                                        accessDate: formData.accessDate,
                                        url: formData.url,
                                        original_text: formData.original_text,
                                }
                                break;
                        default:
                                data = {
                                        authors: formData.authors,
                                        type: "book",
                                        title: formData.title,
                                        editor: formData.editor,
                                        publisher: formData.publisher,
                                        publishLocation: formData.publishLocation,
                                        year: formData.year,
                                        doi: formData.doi,
                                        url: formData.url,
                                        original_text: formData.original_text,
                                }
                                break;
                }
                dispatch(
                        updateLanguageCorrectionReference({
                                body: { reference: { ...data }, referenceId: formData.referenceId, },
                                options: { id: articleId, btnLoader: true, __module: 'articleLanguageCorrection', showToast: true },
                        }));
                toggleModal('#showUpdateReferenceModel')
        }

        return (
                <Modal id={`showUpdateReferenceModel`}>
                        <Modal.Header className="py-4">
                                <h3 className="fs-5 mb-0"> <i className="ai-user text-primary lead pe-1 me-2" /> Update Reference</h3>
                                <button className="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close" />
                        </Modal.Header>
                        <Modal.Body>
                                <div className="card-body pb-4">
                                        <form onSubmit={handleSubmit(updateReferenceHandle)}>
                                                <div className="row g-3 g-sm-4 mt-0">
                                                        <input placeholder='Reference Id' className={`form-control ${errors.referenceId ? 'is-invalid' : ''}`}
                                                                {...register('referenceId', {
                                                                        required: 'Reference is required',
                                                                        value: selectedReference?._id,
                                                                })} type="hidden" id="referenceId" />
                                                        <div className="col-sm-12">
                                                                <label className="form-label" htmlFor="type">Type</label>
                                                                <select id='type' onChange={(e) => setReference(e.target.value)}
                                                                value={reference}
                                                                className='form-select'>
                                                                       <option value={`book`}>BOOK</option>
                                                                       <option value={`journal`}>JOURNAL</option>
                                                                       <option value={`website`}>WEBSITE</option>
                                                               </select>
                                                        </div>

                                                        {
                                                                reference !== '' && (
                                                                        <>
                                                                                {(reference === 'book' || reference === 'journal') ?
                                                                                        <div className="col-sm-12">
                                                                                                <label className="form-label" htmlFor="authors">Authors  <span style={{ color: "red" }}>*</span></label>
                                                                                                <input placeholder='Authors' className={`form-control ${errors.authors ? 'is-invalid' : ''}`}
                                                                                                        {...register('authors', {
                                                                                                                required: 'Authors is required',
                                                                                                                value: selectedReference?.authors,
                                                                                                        })} type="text" id="authors" />
                                                                                                <div className="invalid-feedback">{errors.authors?.message}</div>
                                                                                        </div> : <></>
                                                                                }
                                                                                <div className="col-sm-6" hidden>
                                                                                        <label className="form-label" htmlFor="type">Type</label>
                                                                                        <input placeholder='Type' className={`form-control ${errors.type ? 'is-invalid' : ''}`}
                                                                                                {...register('type', {
                                                                                                        value: reference,
                                                                                                })} type="text" id="type" />
                                                                                        <div className="invalid-feedback">{errors.type?.message}</div>
                                                                                </div>
                                                                                <div className="col-sm-12">
                                                                                        <label className="form-label" htmlFor="email">Title  <span style={{ color: "red" }}>*</span></label>
                                                                                        <input placeholder='Title' className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                                                                                {...register('title', {
                                                                                                        required: "Title is required",
                                                                                                        value: selectedReference?.title,
                                                                                                })}
                                                                                                type="text" id="title" />
                                                                                        <div className="invalid-feedback">{errors.title?.message}</div>
                                                                                </div>
                                                                                {reference === 'journal' &&
                                                                                        <div className="col-sm-12">
                                                                                                <label className="form-label" htmlFor="journal">Source Name   <span style={{ color: "red" }}>*</span></label>
                                                                                                <input placeholder='Source name' className={`form-control ${errors.journal ? 'is-invalid' : ''}`}
                                                                                                        {...register('journal', {
                                                                                                                value: selectedReference?.journal,
                                                                                                        })}
                                                                                                        type="text" id="journal" />
                                                                                                <div className="invalid-feedback">{errors.journal?.message}</div>
                                                                                        </div>
                                                                                }
                                                                                {reference === 'book' &&
                                                                                        <div className="col-sm-6">
                                                                                                <label className="form-label" htmlFor="editor">Editor   <span style={{ color: "red" }}>*</span></label>
                                                                                                <input placeholder='Editor' className={`form-control ${errors.editor ? 'is-invalid' : ''}`}
                                                                                                        {...register('editor', {
                                                                                                                value: selectedReference?.editor,
                                                                                                        })}
                                                                                                        type="text" id="editor" />
                                                                                                <div className="invalid-feedback">{errors.editor?.message}</div>
                                                                                        </div>
                                                                                }
                                                                                {reference === 'book' &&
                                                                                        <div className="col-sm-6">
                                                                                                <label className="form-label" htmlFor="publisher">Publisher  <span style={{ color: "red" }}>*</span></label>
                                                                                                <input placeholder='Publisher' className={`form-control ${errors.publisher ? 'is-invalid' : ''}`}
                                                                                                        {...register('publisher', {
                                                                                                                value: selectedReference?.publisher,
                                                                                                        })}
                                                                                                        type="text" id="publisher" />
                                                                                                <div className="invalid-feedback">{errors.publisher?.message}</div>
                                                                                        </div>
                                                                                }
                                                                                {reference === 'book' &&
                                                                                        <div className="col-sm-6">
                                                                                                <label className="form-label" htmlFor="publishLocation">Publish Location  <span style={{ color: "red" }}>*</span></label>
                                                                                                <input placeholder='Location' className={`form-control ${errors.publishLocation ? 'is-invalid' : ''}`}
                                                                                                        {...register('publishLocation', {
                                                                                                                value: selectedReference?.publishLocation,
                                                                                                        })}
                                                                                                        type="text" id="publishLocation" />
                                                                                                <div className="invalid-feedback">{errors.publishLocation?.message}</div>
                                                                                        </div>
                                                                                }
                                                                                {reference === 'journal' &&
                                                                                        <>
                                                                                                <div className="col-sm-6">
                                                                                                        <label className="form-label" htmlFor="pages">Pages  <span style={{ color: "red" }}>*</span></label>
                                                                                                        <input placeholder='Page' className={`form-control ${errors.pages ? 'is-invalid' : ''}`}
                                                                                                          x      {...register('pages', {
                                                                                                                        value: selectedReference?.pages,
                                                                                                                })}
                                                                                                                type="text" id="pages" />
                                                                                                        <div className="invalid-feedback">{errors.pages?.message}</div>
                                                                                                </div>
                                                                                                <div className="col-sm-6">
                                                                                                        <label className="form-label" htmlFor="volume">Volume  <span style={{ color: "red" }}>*</span></label>
                                                                                                        <input placeholder='Volume' className={`form-control ${errors.volume ? 'is-invalid' : ''}`}
                                                                                                                {...register('volume', {
                                                                                                                        value: selectedReference?.volume,
                                                                                                                })}
                                                                                                                type="text" id="volume" />
                                                                                                        <div className="invalid-feedback">{errors.volume?.message}</div>
                                                                                                </div>
                                                                                                <div className="col-sm-6">
                                                                                                        <label className="form-label" htmlFor="issue">Issue  <span style={{ color: "red" }}>*</span></label>
                                                                                                        <input placeholder='Issue' className={`form-control ${errors.issue ? 'is-invalid' : ''}`}
                                                                                                                {...register('issue', {
                                                                                                                        value: selectedReference?.issue,
                                                                                                                })}
                                                                                                                type="text" id="issue" />
                                                                                                        <div className="invalid-feedback">{errors.issue?.message}</div>
                                                                                                </div>
                                                                                        </>
                                                                                }
                                                                                {reference === 'website' &&
                                                                                        <div className="col-sm-6">
                                                                                                <label className="form-label" htmlFor="accessDate">Access Data  <span style={{ color: "red" }}>*</span></label>
                                                                                                <input placeholder='Access data' className={`form-control ${errors.accessData ? 'is-invalid' : ''}`}
                                                                                                        {...register('accessDate', {
                                                                                                                value: selectedReference?.accessDate,
                                                                                                        })}
                                                                                                        type="date" id="accessDate" />
                                                                                                <div className="invalid-feedback">{errors.accessData?.message}</div>
                                                                                        </div>
                                                                                }
                                                                                <div className="col-sm-6">
                                                                                        <label className="form-label" htmlFor="year">Year  <span style={{ color: "red" }}>*</span></label>
                                                                                        <input placeholder='Year' className={`form-control ${errors.year ? 'is-invalid' : ''}`}
                                                                                                {...register('year', {
                                                                                                        value: selectedReference?.year,
                                                                                                })}
                                                                                                type="text" id="year" />
                                                                                        <div className="invalid-feedback">{errors.year?.message}</div>
                                                                                </div>
                                                                                <div className="col-sm-12">
                                                                                        <label className="form-label" htmlFor="doi">DOI  <span style={{ color: "red" }}>*</span></label>
                                                                                        <input placeholder='doi' className={`form-control ${errors.url ? 'is-invalid' : ''}`}
                                                                                                {...register('doi', {
                                                                                                        value: selectedReference?.doi,
                                                                                                })}
                                                                                                type="text" id="doi" />
                                                                                        <div className="invalid-feedback">{errors.doi?.message}</div>
                                                                                </div>
                                                                                <div className="col-sm-12">
                                                                                        <label className="form-label" htmlFor="url">URL  <span style={{ color: "red" }}>*</span></label>
                                                                                        <input placeholder='url' className={`form-control ${errors.url ? 'is-invalid' : ''}`}
                                                                                                {...register('url', {
                                                                                                        value: selectedReference?.url,
                                                                                                })}
                                                                                                type="text" id="url" />
                                                                                        <div className="invalid-feedback">{errors.url?.message}</div>
                                                                                </div>
                                                                                <div className="col-sm-12">
                                                                                        <label className="form-label" htmlFor="original_text">original Text </label>
                                                                                        <textarea
                                                                                                className={`form-control ${errors.original_text ? 'is-invalid' : ''}`}
                                                                                                {...register('original_text', {
                                                                                                        placeholder: "original Text",
                                                                                                        value: selectedReference?.original_text,
                                                                                                }
                                                                                                )}
                                                                                                id="original_text"
                                                                                                rows={5}
                                                                                        />
                                                                                        <div className="invalid-feedback">{errors.original_text?.message}</div>
                                                                                </div>
                                                                        </>
                                                                )}
                                                        <div className="col-12 d-flex justify-content-end pt-3">
                                                                <UpdateButton className='btn btn-primary ms-3' title="Save" type='submit' />
                                                        </div>
                                                </div>
                                        </form>
                                </div>
                        </Modal.Body>
                </Modal>
        );
};

export default UpdateLanguageCorrectionReferenceModel;