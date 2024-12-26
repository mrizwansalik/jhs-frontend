/* eslint-disable */
import React, { useEffect, useState, Suspense } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { updateRevisionReferenceSorting, getSpecificRevisionReference, removeRevisionReference, addRevisionReference, generateRevisionReference } from '../../../../store/main/articlesRevisionReference/actions';
import UpdateButton from '../../../../components/button/Button';

import { DropdownItem, Col, Row } from 'reactstrap';
import '../../../../components/DndKit/style.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
import { Bold, Italic, Underline } from '@ckeditor/ckeditor5-basic-styles';
import { Heading } from '@ckeditor/ckeditor5-heading';
import { Link as CkLink } from '@ckeditor/ckeditor5-link';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import Subscript from '@ckeditor/ckeditor5-basic-styles/src/subscript';
import Superscript from '@ckeditor/ckeditor5-basic-styles/src/superscript';

import ShowJournalReference from '../operations/ShowJournalReference';
import ShowBookReference from '../operations/ShowBookReference';
import ShowWebsiteReference from '../operations/ShowWebsiteReference';
import { toggleModal } from 'helpers/globalHelpers';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import UpdateRevisionReferenceModel from '../operations/UpdateRevisionReferenceModel';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const ReOrderableGrid = React.lazy(() => import('../../../../components/DndKit/ReOrderableGrid'));
const ReOrderableItem = React.lazy(() => import('../../../../components/DndKit/ReOrderableItem'));
const initial = {
    email: null,
    initialLoad: false,
    isUserAdded: false
}
const RevisionReference = () => {
    const dispatch = useDispatch();
    let { articleId } = useParams();
    const navigate = useNavigate();
    const articleInfo = useSelector((state) => state.articleRevision.single);
    const [reference, setReference] = useState('');
    const [state, setState] = useState(initial);
    const [items, setItems] = useState([]);

    const MySwal = withReactContent(Swal);

    let generateArticleText = '';

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm({ reValidateMode: 'onChange' });

    useEffect(() => {
        reset();
        const arr = [];
        if (articleInfo?.articleRevision_data_id?.reference?.length) {
            articleInfo.articleRevision_data_id.reference.map((item) => {
                arr.push({ id: item._id, ...item })
            });
        }
        setItems(arr);
    }, [articleInfo]);

    useEffect(() => {
        setState({ ...state, initialLoad: true });
        //dispatch(getPublicDepartments({ body: {}, options: { __module: 'department' } }));
    }, []);

    const updateReferenceSortingHandle = () => {
        const data = items;
        dispatch(
            updateRevisionReferenceSorting({
                body: { reference: data },
                options: { id: articleId, btnLoader: true, __module: 'articleRevision', showToast: true },
            }));
            navigate(`/main/article/${articleId}/revision/summary`);
    }

    const updateReferenceHandler = (referenceId) => {
        dispatch(
            getSpecificRevisionReference({
                options: { id: articleId, referenceId: referenceId, btnLoader: true, __module: 'articleRevision', showToast: false },
            }));
        toggleModal('#showUpdateReferenceModel')
    }

    const removeReferenceFromArticle = (referenceId) => {
        

        const swalWithBootstrapButtons = MySwal.mixin({
            customClass: {
                confirmButton: 'btn btn-success m-1',
                cancelButton: 'btn btn-danger m-1'
            },
            buttonsStyling: false,
        })
        swalWithBootstrapButtons.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Remove it!',
            cancelButtonText: 'No, cancel!',
            confirmButtonColor: 'btn btn-success m-1',
            cancelButtonColor: 'btn btn-danger m-1',
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(
                    removeRevisionReference({
                        body: { reference: [{ _id: referenceId }] },
                        options: { id: articleId, btnLoader: true, __module: 'articleRevision', showToast: true },
                    }));
            }
        })
    }

    const addReferenceHandle = (formData) => {
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
                    url: formData.url,
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
                }
                break;
            case 'website':
                data = {
                    title: formData.title,
                    type: "website",
                    year: formData.year,
                    accessDate: formData.accessDate,
                    url: formData.url,
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
                }
                break;
        }
        dispatch(
            addRevisionReference({
                body: { reference: { ...data } },
                options: { id: articleId, btnLoader: true, __module: 'articleRevision', showToast: true },
            }));
    }

    const handleArticleData = (data) => {
        generateArticleText = data;
    }

    const generateReferenceHandle = (formData) => {
        dispatch(
            generateRevisionReference({
                body: { reference: generateArticleText },
                options: { id: articleId, btnLoader: true, __module: 'articleRevision', showToast: true },
            }));
    }

    if (!articleInfo || !items) {
        return "Loading";
    }

    return (
        <>
            <div className="col-lg-9">
                {/* Journals list */}
                <section className="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
                    <div className="card-body">
                        <div className="row g-3 g-sm-4">
                            <div className="col-sm-12">
                                <div className="text-center text-lg-start ">
                                    <h3 className="h3 mb-4">
                                        Let's take care of your references
                                    </h3>
                                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2 g-4 pb-3">
                                        <div className="col">
                                            <div className="card text-center h-100 rounded-3 p-3 p-sm-4">
                                                <div className="d-flex align-items-center">
                                                    <div className="card-body">
                                                        <button className="btn btn-primary" onClick={(e) => setReference("generator")} >Launch reference generator</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="card text-center h-100 rounded-3 p-3 p-sm-4">
                                                <div className="d-flex align-items-center">
                                                    <div className="card-body">
                                                        <select id='referenceSelect' onChange={(e) => setReference(e.target.value)} className='form-select'>
                                                            <option>BOOK</option>
                                                            <option>JOURNAL</option>
                                                            <option>WEBSITE</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                </div>
                                {
                                    reference !== '' && (
                                        reference !== 'generator' ?
                                            <div className='card boarder-1'>
                                                <div className="card-body m-2 pt-2">
                                                    <form onSubmit={handleSubmit(addReferenceHandle)}>
                                                        <div className="row g-3 g-sm-4 mt-0">
                                                            {
                                                                (reference === 'BOOK' || reference === 'JOURNAL') &&
                                                                <div className="col-sm-12">
                                                                    <label className="form-label" htmlFor="authors">Authors</label>
                                                                    <input placeholder='Authors' className={`form-control ${errors.authors ? 'is-invalid' : ''}`}
                                                                        {...register('authors', {
                                                                            required: 'Authors is required',

                                                                        })} type="text" id="authors" />
                                                                    <div className="invalid-feedback">{errors.authors?.message}</div>
                                                                </div>
                                                            }
                                                            <div className="col-sm-6 hidden">
                                                                <label className="form-label" htmlFor="type">Type</label>
                                                                <input placeholder='Type' className={`form-control ${errors.type ? 'is-invalid' : ''}`}
                                                                    {...register('type', {

                                                                    })} type="text" id="type" />
                                                                <div className="invalid-feedback">{errors.type?.message}</div>
                                                            </div>
                                                            <div className="col-sm-6">
                                                                <label className="form-label" htmlFor="email">Title</label>
                                                                <input placeholder='Title' className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                                                    {...register('title', {
                                                                        required: "Title is required",


                                                                    })}
                                                                    type="text" id="title" />
                                                                <div className="invalid-feedback">{errors.title?.message}</div>
                                                            </div>
                                                            {reference === 'JOURNAL' &&
                                                                <div className="col-sm-12">
                                                                    <label className="form-label" htmlFor="journal">Source Name </label>
                                                                    <input placeholder='Source name' className={`form-control ${errors.journal ? 'is-invalid' : ''}`}
                                                                        {...register('journal', {

                                                                        })}
                                                                        type="text" id="journal" />
                                                                    <div className="invalid-feedback">{errors.journal?.message}</div>
                                                                </div>
                                                            }
                                                            {reference === 'BOOK' &&
                                                                <div className="col-sm-6">
                                                                    <label className="form-label" htmlFor="editor">Editor </label>
                                                                    <input placeholder='Editor' className={`form-control ${errors.editor ? 'is-invalid' : ''}`}
                                                                        {...register('editor', {

                                                                        })}
                                                                        type="text" id="editor" />
                                                                    <div className="invalid-feedback">{errors.editor?.message}</div>
                                                                </div>
                                                            }
                                                            {reference === 'BOOK' &&
                                                                <div className="col-sm-6">
                                                                    <label className="form-label" htmlFor="publisher">Publisher</label>
                                                                    <input placeholder='Publisher' className={`form-control ${errors.publisher ? 'is-invalid' : ''}`}
                                                                        {...register('publisher', {

                                                                        })}
                                                                        type="text" id="publisher" />
                                                                    <div className="invalid-feedback">{errors.publisher?.message}</div>
                                                                </div>
                                                            }
                                                            {reference === 'BOOK' &&
                                                                <div className="col-sm-6">
                                                                    <label className="form-label" htmlFor="publishLocation">Publish Location </label>
                                                                    <input placeholder='Location' className={`form-control ${errors.publishLocation ? 'is-invalid' : ''}`}
                                                                        {...register('publishLocation', {

                                                                        })}
                                                                        type="text" id="publishLocation" />
                                                                    <div className="invalid-feedback">{errors.publishLocation?.message}</div>
                                                                </div>
                                                            }
                                                            {reference === 'JOURNAL' &&
                                                                <>
                                                                    <div className="col-sm-6">
                                                                        <label className="form-label" htmlFor="pages">Pages </label>
                                                                        <input placeholder='Page' className={`form-control ${errors.pages ? 'is-invalid' : ''}`}
                                                                            {...register('pages', {

                                                                            })}
                                                                            type="text" id="pages" />
                                                                        <div className="invalid-feedback">{errors.pages?.message}</div>
                                                                    </div>

                                                                    <div className="col-sm-6">
                                                                        <label className="form-label" htmlFor="volume">Volume </label>
                                                                        <input placeholder='Volume' className={`form-control ${errors.volume ? 'is-invalid' : ''}`}
                                                                            {...register('volume', {

                                                                            })}
                                                                            type="text" id="volume" />
                                                                        <div className="invalid-feedback">{errors.volume?.message}</div>
                                                                    </div>

                                                                    <div className="col-sm-6">
                                                                        <label className="form-label" htmlFor="issue">Issue </label>
                                                                        <input placeholder='Issue' className={`form-control ${errors.issue ? 'is-invalid' : ''}`}
                                                                            {...register('issue', {

                                                                            })}
                                                                            type="text" id="issue" />
                                                                        <div className="invalid-feedback">{errors.issue?.message}</div>
                                                                    </div>
                                                                </>
                                                            }
                                                            {reference === 'WEBSITE' &&
                                                                <div className="col-sm-6">
                                                                    <label className="form-label" htmlFor="accessDate">Access Data </label>
                                                                    <input placeholder='Access data' className={`form-control ${errors.accessData ? 'is-invalid' : ''}`}
                                                                        {...register('accessDate', {

                                                                        })}
                                                                        type="date" id="accessDate" />
                                                                    <div className="invalid-feedback">{errors.accessData?.message}</div>
                                                                </div>
                                                            }
                                                            <div className="col-sm-6">
                                                                <label className="form-label" htmlFor="year">Year </label>
                                                                <input placeholder='Year' className={`form-control ${errors.year ? 'is-invalid' : ''}`}
                                                                    {...register('year', {

                                                                    })}
                                                                    type="text" id="year" />
                                                                <div className="invalid-feedback">{errors.year?.message}</div>
                                                            </div>
                                                            <div className="col-sm-12">
                                                                <label className="form-label" htmlFor="doi">DOI </label>
                                                                <input placeholder='doi' className={`form-control ${errors.url ? 'is-invalid' : ''}`}
                                                                    {...register('doi', {

                                                                    })}
                                                                    type="text" id="doi" />
                                                                <div className="invalid-feedback">{errors.doi?.message}</div>
                                                            </div>
                                                            <div className="col-sm-12">
                                                                <label className="form-label" htmlFor="url">URL </label>
                                                                <input placeholder='url' className={`form-control ${errors.url ? 'is-invalid' : ''}`}
                                                                    {...register('url', {

                                                                    })}
                                                                    type="text" id="url" />
                                                                <div className="invalid-feedback">{errors.url?.message}</div>
                                                            </div>
                                                            <div className="col-12 d-flex justify-content-end pt-3">
                                                                <button className="btn btn-secondary" type='button' onClick={(e) => setReference('')}>Cancel</button>
                                                                <UpdateButton className='btn btn-primary ms-3' title="Save" type='submit' />
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                            :
                                            <form onSubmit={handleSubmit(generateReferenceHandle)}>
                                                <CKEditor
                                                    editor={ClassicEditor}
                                                    config={{
                                                        plugins: [
                                                            Essentials, Heading, Bold, Italic, Subscript, Superscript, Underline, CkLink, Paragraph,
                                                        ],
                                                        toolbar: ['heading', '|', 'bold', 'italic', 'Subscript', 'Superscript'],
                                                        allowedContent: true,
                                                        editorplaceholder: `Please create your table in Microsoft Word, Excel Google Docs or Google Sheets. When you are finished editing your table, please copy and paste it here by selecting Paste from the Edit menu in your browser toolbar OR using the following key commands: 'Ctrl+V' on PC or 'Cmd+V' on Mac.`,
                                                        resize_enabled: false,
                                                        autoGrow_Height: 400,
                                                        autoGrow_maxHeight: 600,
                                                    }}
                                                    data={''}
                                                    onReady={editor => {
                                                        handleArticleData(editor.getData());
                                                        editor.editing.view.change((writer) => {
                                                            writer.setStyle("min-height", "400px", editor.editing.view.document.getRoot());
                                                            writer.setStyle("max-height", "400px", editor.editing.view.document.getRoot());
                                                        });
                                                    }}
                                                    onChange={(event, editor) => {
                                                        handleArticleData(editor.getData());
                                                    }}
                                                />
                                                <div className="col-12 d-flex justify-content-end pt-3">
                                                    <button className="btn btn-secondary" type='button' onClick={(e) => setReference('')} >Cancel</button>
                                                    <UpdateButton className='btn btn-outline-primary ms-3' title="Generate References" type='submit' />
                                                </div>
                                            </form>
                                    )}
                                <div className="pb-3 mt-5">
                                    <Row>
                                        <Col>
                                            <Suspense fallback={<div> Please Wait... </div>} >
                                                <ReOrderableGrid
                                                    id="broken"
                                                    items={items}
                                                    onReorder={newItems => setItems(newItems)}
                                                >
                                                    {items?.map((item, index) => (
                                                        <ReOrderableItem
                                                            id={item?._id ?? index}
                                                            key={"referenceItem-" + item?.id}
                                                            menu={[
                                                                <DropdownItem key={"updateReferenceItem-" + item?._id} onClick={() => updateReferenceHandler(item?._id)}>Update Reference</DropdownItem>,
                                                                <DropdownItem key={"unassignReferenceItem-" + item?._id} onClick={() => removeReferenceFromArticle(item?._id)}>Remove Reference</DropdownItem>,
                                                            ]}
                                                        >
                                                            {
                                                                item?.type == 'journal' ? 
                                                                    <ShowJournalReference reference={item} position={++index} />
                                                                : 
                                                                    item?.type == 'book' ?  
                                                                        <ShowBookReference reference={item} position={++index} />
                                                                        :  
                                                                        <ShowWebsiteReference reference={item} position={++index} />
                                                                
                                                            }
                                                        </ReOrderableItem>
                                                    ))}
                                                </ReOrderableGrid>
                                            </Suspense>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                            <div className="col-12 d-flex justify-content-end pt-3">
                                <Link className="btn btn-secondary" to='/main/dashboard'>Cancel</Link>
                                <button className='btn btn-primary ms-3' type='button' onClick={updateReferenceSortingHandle}>Save & Continue</button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <UpdateRevisionReferenceModel
                articleId={articleId}
            />
        </>
    );
};

export default RevisionReference;