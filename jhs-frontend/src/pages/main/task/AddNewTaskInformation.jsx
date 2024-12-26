/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../../../components/button/Button';

import { addTaskToArticle, getTaskDetail } from 'store/main/task/actions';
import { checkFeaturePermission } from 'helpers/globalHelpers';
import * as CKEditor from '@ckeditor/ckeditor5-react';
import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Bold, Italic, Subscript, Superscript, Underline } from '@ckeditor/ckeditor5-basic-styles';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';

const AddNewTaskInformation = () => {
    const dispatch = useDispatch();
    const articleList = useSelector((state) => state.article.list);
    const permission = useSelector((state) => state.profile.role);

    const [editorData, setEditorData] = useState('');
    const handleArticleData = (data) => {
        setEditorData(data)
    }
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({ reValidateMode: 'onChange' });

    useEffect(() => {
        if (permission && permission.length) {
            !checkFeaturePermission('task-add') && navigate('/not-found');
        }
    }, [permission]);

    const addTaskHandle = (formData) => {
        formData.description = editorData;
        dispatch(
            addTaskToArticle({
                body: { ...formData },
                options: { btnLoader: true, __module: 'task', showToast: true },
            }));
    }

    if (!permission) {
        return '';
    } // end if

    return (
        <>
            <div className="col-lg-12 pt-4 pb-2 pb-sm-4">
                <h1 className="h2 mb-4">Task Information</h1>
                {/* Article Status list */}
                <section className="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
                    {checkFeaturePermission('task-add') ?
                        <div className="card-body">
                            <div className="d-flex align-items-center mt-sm-n1 pb-2 mb-1">
                                <i className="ai-tag text-primary lead pe-1 me-2" />
                                <h2 className="h4 mb-0">Add Task</h2>
                            </div>
                            <form onSubmit={handleSubmit(addTaskHandle)}>
                                <div className='row'>
                                    <div className='col-md-8'>

                                        <div className="row g-3 g-sm-4 mt-0 mt-lg-2">
                                            <div className="col-sm-12">
                                                <label className="form-label" htmlFor="title">Title</label>
                                                <input className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                                    {...register('title', {
                                                        required: 'Task title is required',
                                                    })} type="text" id="title" />
                                                <div className="invalid-feedback">{errors.title?.message}</div>
                                            </div>
                                            <div className="col-sm-12">
                                                <label className="form-label" htmlFor="description">Description</label>
                                                <CKEditor
                                                    editor={ClassicEditor}
                                                    config={{
                                                        plugins: [Essentials, Bold, Italic, Subscript, Superscript, Underline, Paragraph],
                                                        toolbar: ['bold', 'italic', 'Subscript', 'Superscript'],
                                                        allowedContent: true,
                                                        removeButtons: 'Save,NewPage,Preview,Print,Templates',
                                                        format_tags: 'h2;h3;div',
                                                        editorplaceholder: `Please create your table in Microsoft Word, Excel Google Docs or Google Sheets. When you are finished editing your table, please copy and paste it here by selecting Paste from the Edit menu in your browser toolbar OR using the following key commands: 'Ctrl+V' on PC or 'Cmd+V' on Mac.`,
                                                        resize_enabled: false,
                                                        autoGrow_Height: 400,
                                                        autoGrow_maxHeight: 600,
                                                    }}
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
                                                    data={editorData}
                                                />
                                                <div className="invalid-feedback">{errors.description?.message}</div>
                                            </div>
                                            <div className="col-sm-6">
                                                <label className="form-label" htmlFor="dueDate">Due Date</label>
                                                <input className={`form-control ${errors.dueDate ? 'is-invalid' : ''}`}
                                                    {...register('dueDate', {
                                                        required: 'Due date is required',
                                                    })} type="text" id="dueDate" />
                                                <div className="invalid-feedback">{errors.dueDate?.message}</div>
                                            </div>
                                            <div className="col-sm-6">
                                                <label className="form-label" htmlFor="assignedTo">Assign to</label>
                                                <input className={`form-control ${errors.assignedTo ? 'is-invalid' : ''}`}
                                                    {...register('assignedTo', {
                                                        required: 'Status meta issue is required',
                                                    })} type="text" id="assignedTo" />
                                                <div className="invalid-feedback">{errors.assignedTo?.message}</div>
                                            </div>
                                            <div className="col-sm-6">
                                                <label className="form-label" htmlFor="articleId">Article Info</label>
                                                <input className={`form-control ${errors.articleId ? 'is-invalid' : ''}`}
                                                    {...register('articleId', {
                                                        required: 'Article Info is required',
                                                    })} type="text" id="articleId" />
                                                <div className="invalid-feedback">{errors.articleId?.message}</div>
                                            </div>
                                            <div className="col-12 d-flex justify-content-end pt-3">
                                                <Link className="btn btn-secondary" to='/main/dashboard/task'>Cancel</Link>
                                                <Button className='btn btn-primary ms-3' title="Add Task" type='submit' />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </form>
                        </div>
                        :
                        <>Permission error</>
                    }
                </section>
            </div>
        </>
    )
}

export default AddNewTaskInformation;