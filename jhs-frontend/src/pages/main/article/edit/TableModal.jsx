/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import Model from '../../../../components/Modal';

import { toggleModal } from 'helpers/globalHelpers';

// import { CKEditor } from 'ckeditor4-react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
import { Bold, Italic, Underline, Subscript, Superscript } from '@ckeditor/ckeditor5-basic-styles';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Heading } from '@ckeditor/ckeditor5-heading';
import { Link as CkLink } from '@ckeditor/ckeditor5-link';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { Table, TableToolbar } from '@ckeditor/ckeditor5-table';


import { Button } from 'reactstrap';
import { addArticleTable, updateArticleTable } from 'store/main/articles/actions';
import { useDispatch } from 'react-redux';

const TableModel = ({ tableEditId, articleId, editor, tableData, setTableEditId, tableLength = 0 }) => {
    const [tableCount, setTableCount] = useState(0);
    const dispatch = useDispatch();
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm({ reValidateMode: 'onChange' });

    // const position = editor.model.document.selection.getFirstPosition();

    useEffect(() => {
        // if (tableData) {
        reset({
            table_title: tableData?.title ?? '',
            table_legend: tableData?.label ?? '',
        })
        setArticleTable(tableData?.data ?? '');
        // }
    }, [tableData])



    const editorConfig = {
        plugins: [Essentials, Heading, Bold, Italic, Underline,
            CkLink, Paragraph, Table, TableToolbar, Subscript, Superscript],

        toolbar: [
            'Bold', 'Italic', 'Subscript', 'Superscript',
        ],
        allowedContent: true,
        removeButtons: 'Save,NewPage,Preview,Print,Templates',
        format_tags: 'h2;h3;div',
        editorplaceholder: `Please create your table in Microsoft Word, Excel Google Docs or Google Sheets. When you are finished editing your table, please copy and paste it here by selecting Paste from the Edit menu in your browser toolbar OR using the following key commands: 'Ctrl+V' on PC or 'Cmd+V' on Mac.`,
        resize_enabled: false,
        autoGrow_Height: 400,
        autoGrow_maxHeight: 600,
    };

    const [articleTable, setArticleTable] = useState('');
    const handleArticleDataChange = (evt, editor) => {
        setArticleTable(editor.getData());
    };

    const updateTableHandle = async (formData) => {
        const data = {
            'data': articleTable,
            'title': formData.table_title,
            'label': formData.table_legend,
        }

        tableData ?
            dispatch(updateArticleTable({
                body: { ...data, tableId: tableData._id },
                options: { id: articleId, btnLoader: true, __module: 'article', showToast: true },
                editor
            }))
            :
            dispatch(addArticleTable({
                body: data,
                options: { id: articleId, btnLoader: true, __module: 'article', showToast: true },
                editor
            }));

        reset({
            table_title: '',
            table_legend: '',
        })
        setArticleTable(tableData?.data ?? '');

setTimeout(() => {
    const event = new Event("updateTable");
    window.dispatchEvent(event);
}, 200)
        

        toggleModal('#insertTableWidget');
    }

    const handleToggle = () => {
        const myModalEl = document.querySelector('#insertTableWidget');
        const modal = window.bootstrap.Modal.getOrCreateInstance(myModalEl);


        modal.hide();

        setTableEditId('');
    }

    useEffect(() => {
        const modal = document.querySelector('#insertTableWidget');

        modal.addEventListener('hidden.bs.modal', function (e) {
            setTableEditId('')
        });
        modal.addEventListener('show.bs.modal', function (e) {

            const position = editor?.model.document.selection.getFirstPosition();
            editor?.model.change(writer => {
                const root = editor.model.document.getRoot();
                // let index = 1;
                let index = tableLength + 1; // ??

                const range = writer.createRangeIn(root);
                for (const value of range.getWalker()) {
                    if (!tableEditId && value.type === "elementEnd" && value.item.is("element", "tablePreview") && value.nextPosition.path[0] <= position.path[0]) {
                        index++
                    }
                    if (value.type === "elementEnd" && value.item.is("element", "tablePreview") && tableEditId && value.item._attrs.get('id') === tableEditId) {
                        index++
                    }
                }
                setTableCount(index)

            });
        });

        () => modal.removeEventListener('hidden.bs.modal', () => {
            setTableEditId('')
        })
    }, [editor?.getData()])



    return (
        <Model id='insertTableWidget'>
            <Model.Header>
                <h4 className="modal-title">Insert Table</h4>
                <button className="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close" onClick={handleToggle}></button>
            </Model.Header>
            <Model.Body>
                <form onSubmit={handleSubmit(updateTableHandle)} id="table_model">
                    <div className="row g-3 g-sm-4">
                        <div className="col-sm-12">
                            <div className="text-center text-lg-start">
                                <div className="pb-3">
                                    <label className="form-label" htmlFor="table_title">Table title</label>
                                    <div className="input-group">
                                        <span className="input-group-text">{`Table ${tableCount}:`}</span>
                                        {/* <span className="input-group-text">{`Table:`}</span> */}
                                        <input className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                            {...register('table_title', {
                                                required: 'Table title is required',
                                            })} type="text" id="table_title"
                                            placeholder="Enter your descriptive title here (required). Do not include reference citations." />
                                        <div className="invalid-feedback">{errors.title?.message}</div>
                                    </div>
                                </div>
                                <div className="pb-3">
                                    <label className="form-label" htmlFor="table_legend">legend</label>
                                    <input className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                        {...register('table_legend')} type="text" id="table_legend"
                                        placeholder='Enter your legend here (optional). Please include any abbreviation definitions here.' />
                                    <div className="invalid-feedback">{errors.title?.message}</div>
                                </div>
                                <div className="pb-3">
                                    <label className="form-label" htmlFor="table_legend">Table</label>
                                    <CKEditor
                                        editor={ClassicEditor}
                                        config={editorConfig}
                                        onChange={handleArticleDataChange}
                                        data={articleTable}
                                        onReady={editor => {
                                            // const widgetTypeAroundPlugin = editor.plugins.get('WidgetTypeAround');

                                            // // Disable the widget type around plugin.
                                            // widgetTypeAroundPlugin.forceDisabled('MyApplication');
                                            //handleArticleData(editor.getData());
                                            editor.editing.view.change((writer) => {
                                                writer.setStyle("min-height", "400px", editor.editing.view.document.getRoot());
                                                writer.setStyle("max-height", "400px", editor.editing.view.document.getRoot());
                                            });
                                        }}
                                    />
                                    <div className="invalid-feedback">{errors.title?.message}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </Model.Body>
            <Model.Footer>
                <Button className="btn btn-secondary" type="button" data-bs-dismiss="modal" onClick={handleToggle}>Cancel</Button>
                <button className='btn btn-primary ms-3' form="table_model" title="Add Table" type='submit' >{tableData ? 'Update Table' : 'Add Table'}</button>
            </Model.Footer>
        </Model>
    );
};

export default TableModel;