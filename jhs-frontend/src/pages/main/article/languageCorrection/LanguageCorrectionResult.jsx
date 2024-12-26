/* eslint-disable */
import React, { useEffect,  useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import UpdateButton from '../../../../components/button/Button';
import { deleteArticleLanguageCorrectionFigure, deleteArticleLanguageCorrectionTable, updateArticleLanguageCorrection } from 'store/main/articlesLanguageCorrection/actions';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
import { Bold, Italic, Underline } from '@ckeditor/ckeditor5-basic-styles';
import { Heading } from '@ckeditor/ckeditor5-heading';
import { Link as CkLink } from '@ckeditor/ckeditor5-link';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import Subscript from '@ckeditor/ckeditor5-basic-styles/src/subscript';
import Superscript from '@ckeditor/ckeditor5-basic-styles/src/superscript';
import { Essentials } from '@ckeditor/ckeditor5-essentials';

import PreviewTable from 'ckPlugins/table/PreviewTable';
import PreviewFigure from 'ckPlugins/figure/PreviewFigure';

import InsertTable from 'ckPlugins/table/InsertTable';
import TableModel from './LanguageCorrectionTableModal';
import ArticleLanguageCorrectionTableCardView from '../CardView/ArticleLanguageCorrectionTableCardView';

import InsertFigure from 'ckPlugins/figure/InsertFigure';
import FigureModel from './LanguageCorrectionFigureModal';
import ArticleLanguageCorrectionFigureCardView from '../CardView/ArticleLanguageCorrectionFigureCardView';

const LanguageCorrectionResult = () => {

    const dispatch = useDispatch();

    let { articleId } = useParams();
    const articleInfo = useSelector((state) => state.articleLanguageCorrection.single);
    const selectedArticleType = useSelector((state) => state.articleType.selected);
    const navigate = useNavigate();

    const [editor, setEditor] = useState();
    const [editorData, setEditorData] = useState(articleInfo?.articleLanguageCorrection_data_id?.result ?? '');
    const [tableEditId, setTableEditId] = useState('');
    const [figureEditId, setFigureEditId] = useState('');
    const [tableLength, setTableLength] = useState(-1);
    const [figureLength, setFigureLength] = useState(-1);

    useEffect(() => {
        setEditorData(articleInfo?.articleLanguageCorrection_data_id?.result ?? '')
    }, [articleInfo?.articleLanguageCorrection_data_id?.result])

    const {
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm({ reValidateMode: 'onChange' });

    useEffect(() => {
        reset();
    }, [articleInfo]);

    useEffect(() => {
        if (articleInfo && selectedArticleType) {
            let tableArr = []
            let figureArr = []
            let pageIndex = selectedArticleType?.elements.indexOf("result");
            for (let i = pageIndex - 1; i >= 0; i--) {
                let data = articleInfo?.articleLanguageCorrection_data_id?.[selectedArticleType?.elements[i]] != undefined ? articleInfo?.articleLanguageCorrection_data_id?.[selectedArticleType?.elements[i]] : '<p></p>';
                if (data) {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = data;

                    const tableDataIdArray = [];
                    const elementsWithTableDataId = tempDiv.querySelectorAll('[data-id][widget-type=table]');
                    elementsWithTableDataId.forEach(element => {
                        tableDataIdArray.push(element.getAttribute('data-id'));
                    });
                    tableArr = [...tableArr, ...tableDataIdArray]

                    const figureDataIdArray = [];
                    const elementsWithFigureDataId = tempDiv.querySelectorAll('[data-id][widget-type=figure]');
                    elementsWithFigureDataId.forEach(element => {
                        figureDataIdArray.push(element.getAttribute('data-id'));
                    });
                    figureArr = [...figureArr, ...figureDataIdArray]
                }
                setTableLength(tableArr.length);
                setFigureLength(figureArr.length);
            }
        }
    }, [articleInfo, selectedArticleType, editor])

    const handleArticleData = (data) => {
        setEditorData(data)
    }

    const updateDraftArticleHandle = (formData) => {
        dispatch(
            updateArticleLanguageCorrection({
                body: { "result": editorData },
                options: { id: articleId, btnLoader: true, __module: 'articleLanguageCorrection', showToast: true },
            }));

        let pageIndex = selectedArticleType?.elements.indexOf("result")
        if (selectedArticleType?.elements.length - 1 > pageIndex) {
            navigate(`/main/article/${articleId}/languageCorrection/${selectedArticleType?.elements[++pageIndex]}`);
        } else {
            navigate(`/main/article/${articleId}/languageCorrection/reference`);
        }
    }

    useEffect(() => {
        window.addEventListener("journalArticleLanguageCorrectionDelete", (e) => {
            dispatch(deleteArticleLanguageCorrectionTable({
                body: { articleTableID: e.detail.tableId },
                options: { id: articleId, btnLoader: true, __module: 'articleLanguageCorrection', showToast: true },
                editor
            }))
        }, false);
        window.addEventListener("journalArticleLanguageCorrectionDeleteFigure", (e) => {
            dispatch(deleteArticleLanguageCorrectionFigure({
                body: { articleFigureID: e.detail.figureId },
                options: { id: articleId, btnLoader: true, __module: 'articleLanguageCorrection', showToast: true },
                editor
            }))
        }, false);
    }, [editor])

    return (
        <>
            {
                ((tableLength >= 0 || figureLength >= 0) || (tableLength != -1 && figureLength != -1)) &&
                <div className="col-lg-9">
                    <section className="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
                        <div className="card-body">
                            <form onSubmit={handleSubmit(updateDraftArticleHandle)}>
                                <div className="row g-3 g-sm-4">
                                    <div className="col-sm-12">
                                        <div className="text-center text-lg-start ">
                                            <h3 className="h3 mb-4">
                                                Result
                                            </h3>
                                            <p>
                                                Common questions:
                                                How do I format my citations?
                                                What about subheaders?
                                            </p>
                                            <div className="pb-3">
                                                {articleInfo && <CKEditor
                                                    editor={ClassicEditor}
                                                    config={{
                                                        plugins: [
                                                            Essentials, Heading, Bold, Italic, Subscript, Superscript, Underline, CkLink, Paragraph,
                                                            InsertTable, PreviewTable, InsertFigure, PreviewFigure,
                                                        ],
                                                        tables: {
                                                            tableRenderer: async (id, data, domElement, editor) => {
                                                                const root = createRoot(domElement);
                                                                root.render(
                                                                    <ArticleLanguageCorrectionTableCardView id={id} data={data} setTableEditId={setTableEditId} editor={editor} tableLength={tableLength} />
                                                                );
                                                            }
                                                        },
                                                        figures: {
                                                            figureRenderer: async (id, data, domElement, editor) => {
                                                                const root = createRoot(domElement);
                                                                root.render(
                                                                    <ArticleLanguageCorrectionFigureCardView id={id} data={data} setFigureEditId={setFigureEditId} editor={editor} figureLength={figureLength} />
                                                                );
                                                            }
                                                        },
                                                        tableData: articleInfo?.articleLanguageCorrection_data_id?.table_list,
                                                        figureData: articleInfo?.articleLanguageCorrection_data_id?.figures_list,
                                                        toolbar: ['heading', '|', 'bold', 'italic', 'Subscript', 'Superscript', '|', 'insertTable', 'insertFigure'],
                                                        heading: {
                                                            options: [
                                                                { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                                                                { model: 'heading2', view: 'h4', title: 'Heading', class: 'ck-heading_heading2' },
                                                                { model: 'heading3', view: 'h5', title: 'Subheading', class: 'ck-heading_heading3' },
                                                            ]
                                                        }
                                                    }}
                                                    data={editorData}
                                                    onReady={editor => {
                                                        setEditor(editor);
                                                        handleArticleData(editor.getData());
                                                        editor.editing.view.change((writer) => {
                                                            writer.setStyle("min-height", "400px", editor.editing.view.document.getRoot());
                                                            writer.setStyle("max-height", "400px", editor.editing.view.document.getRoot());
                                                        });
                                                    }}
                                                    onChange={(event, editor) => {
                                                        handleArticleData(editor.getData());
                                                    }}
                                                />}
                                                <div className="invalid-feedback">{errors.result?.message}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 d-flex justify-content-end pt-3">
                                        <Link className="btn btn-secondary" to='/main/dashboard'>Cancel</Link>
                                        <UpdateButton className='btn btn-primary ms-3' title="Save & Continue" type='submit' />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </section>

                    <TableModel
                        tableEditId={tableEditId}
                        articleId={articleId}
                        editor={editor}
                        setTableEditId={setTableEditId}
                        tableData={articleInfo?.articleLanguageCorrection_data_id?.table_list?.find((table) => table._id === tableEditId)}
                        tableLength={tableLength}
                    />

                    <FigureModel
                        figureEditId={figureEditId}
                        articleId={articleId}
                        editor={editor}
                        setFigureEditId={setFigureEditId}
                        figureData={articleInfo?.articleLanguageCorrection_data_id?.figures_list?.find((figure) => figure._id === figureEditId)}
                        figureLength={figureLength}
                    />
                </div>
            }
        </>
    );
};

export default LanguageCorrectionResult;