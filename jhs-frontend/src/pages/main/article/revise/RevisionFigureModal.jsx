/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import Model from '../../../../components/Modal';

import { toggleModal } from 'helpers/globalHelpers';

import { Button } from 'reactstrap';
import { addArticleRevisionFigure, getArticleRevision, updateArticleRevisionFigure } from 'store/main/articlesRevision/actions';
import { useDispatch } from 'react-redux';
import Dropzone from 'components/Dropzone/Dropzone';
import { config as mainConfig } from '../../../../config/config';
import axios from 'axios';

// Import React FilePond
import { FilePond, registerPlugin } from 'react-filepond';

// Import FilePond styles
import 'filepond/dist/filepond.min.css';

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';

import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginImageResize);

const RevisionFigureModel = ({ figureEditId, articleId, editor, figureData, setFigureEditId, figureLength = 0 }) => {
    const [figureCount, setFigureCount] = useState(0);
    const [uploadImage, setUploadImage] = useState({ preview: "", raw: "" });

    const [files, setFiles] = useState([])

    const dispatch = useDispatch();
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm({ reValidateMode: 'onChange' });

    useEffect(() => {
        reset({
            figure_title: figureData?.title ?? '',
            figure_legend: figureData?.label ?? '',
        })
        setArticleFigure(figureData?.data ?? '');
    }, [figureData])

    const [articleFigure, setArticleFigure] = useState('');
    const handleArticleDataChange = (evt, editor) => {
        setArticleFigure(editor.getData());
    };

    const updateFigureHandle = async (formData) => {
        const appendForm = new FormData();
        appendForm.append("file", uploadImage.raw);
        appendForm.append("title", formData.figure_title);
        appendForm.append("label", formData.figure_legend);
        appendForm.append("data", articleFigure);

        const formDataJSON = {
            title: formData.figure_title,
            label: formData.figure_legend,
            data: articleFigure,
        }

        if (figureData) {
            axios.put(import.meta.env.VITE_REACT_APP_API_URL + `articleRevision/${articleId}/revision/uploadRevisionFigure`, appendForm, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    ...mainConfig.data().defaultHeaders,
                }
            })
                .then(response => {
                    editor.execute("insertFigureData", { id: response.data.data.insertedId, data: { ...formDataJSON, figureId: figureData._id } })
                    dispatch(getArticleRevision({ body: {}, options: { id: articleId, btnLoader: true, __module: 'articleRevision', } }));    //payload.options.id
                })
                .catch(error => {
                    console.error(error);
                });
        } else {
            axios.put(import.meta.env.VITE_REACT_APP_API_URL + `articleRevision/${articleId}/revision/addRevisionFigure`, appendForm, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    ...mainConfig.data().defaultHeaders,
                }
            })
                .then(response => {
                    editor.execute("insertFigureData", { id: response.data.data.insertedId, data: formDataJSON });
                    dispatch(getArticleRevision({ body: {}, options: { id: articleId, btnLoader: true, __module: 'articleRevision', } }));    //payload.options.id
                })
                .catch(error => {
                    console.error(error);
                });
        }

        toggleModal('#insertFigureWidget');
    }

    const handleToggle = () => {
        const myModalEl = document.querySelector('#insertFigureWidget');
        const modal = window.bootstrap.Modal.getOrCreateInstance(myModalEl);

        modal.hide();

        setFigureEditId('');
    }

    useEffect(() => {
        const modal = document.querySelector('#insertFigureWidget');

        modal.addEventListener('hidden.bs.modal', function (e) {
            setFigureEditId('')
        });
        modal.addEventListener('show.bs.modal', function (e) {

            const position = editor?.model.document.selection.getFirstPosition();
            editor?.model.change(writer => {
                const root = editor.model.document.getRoot();
                let index = figureLength + 1; // ??

                const range = writer.createRangeIn(root);
                for (const value of range.getWalker()) {
                    if (!figureEditId && value.type === "elementEnd" && value.item.is("element", "figurePreview") && value.nextPosition.path[0] <= position.path[0]) {
                        index++
                    }

                    if (value.type === "elementEnd" && value.item.is("element", "figurePreview") && figureEditId && value.item._attrs.get('id') === figureEditId) {
                        index++
                    }


                }
                setFigureCount(index)

            });
        });

        () => modal.removeEventListener('hidden.bs.modal', () => {
            setFigureEditId('')
        })
    }, [editor?.getData()])

    const handleImage = (file) => {
        if (file.length) {
            setUploadImage({
                preview: URL.createObjectURL(file[0]),
                raw: file[0]
            });
        }
    }

    return (
        <Model id='insertFigureWidget'>
            <Model.Header>
                <h4 className="modal-title">Insert Figure</h4>
                <button className="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close" onClick={handleToggle}></button>
            </Model.Header>
            <Model.Body>
                <form onSubmit={handleSubmit(updateFigureHandle)} id="figure_model">
                    <div className="row g-3 g-sm-4">
                        <div className="col-sm-12">
                            <div className="text-center text-lg-start">
                                <div className="pb-3">
                                    <label className="form-label" htmlFor="figure_title">Figure title</label>
                                    <div className="input-group">
                                        <span className="input-group-text">{`Figure ${figureCount}:`}</span>
                                        {/* <span className="input-group-text">{`Figure:`}</span> */}
                                        <input className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                            {...register('figure_title', {
                                                required: 'Figure title is required',
                                            })} type="text" id="figure_title"
                                            placeholder="Enter your descriptive title here (required). Do not include reference citations." />
                                        <div className="invalid-feedback">{errors.title?.message}</div>
                                    </div>
                                </div>
                                <div className="pb-3">
                                    <label className="form-label" htmlFor="figure_legend">legend</label>
                                    <input className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                        {...register('figure_legend')} type="text" id="figure_legend"
                                        placeholder='Enter your legend here (optional). Please include any abbreviation definitions here.' />
                                    <div className="invalid-feedback">{errors.title?.message}</div>
                                </div>
                                <div className="pb-3">
                                    <label className="form-label" htmlFor="figure_legend">Figure</label>
                                    <Dropzone handleImage={handleImage} />
                                    <div className="invalid-feedback">{errors.title?.message}</div>
                                </div>
                                <div className="pb-3">
                                    <FilePond
                                        file={files}
                                        onupdatefiles={setFiles}
                                        allowMultiple={true}
                                        maxFiles={1}
                                        server=
                                        {
                                            {
                                                url: import.meta.env.VITE_REACT_APP_API_URL + `article/${articleId}/uploadFigure`,
                                                process: {
                                                    headers: {
                                                        'Content-Type': 'multipart/form-data',
                                                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                                                        ...mainConfig.data().defaultHeaders,
                                                    }
                                                }
                                            }
                                        }
                                        name="file"
                                        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </Model.Body>
            <Model.Footer>
                <Button className="btn btn-secondary" type="button" data-bs-dismiss="modal" onClick={handleToggle}>Cancel</Button>
                <button className='btn btn-primary ms-3' form="figure_model" title="Add Figure" type='submit' >{figureData ? 'Update Figure' : 'Add Figure'}</button>
            </Model.Footer>
        </Model>
    );
};

export default RevisionFigureModel;