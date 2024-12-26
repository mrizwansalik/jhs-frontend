/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import UpdateButton from '../../../../components/button/Button';
import { updateDraftArticle } from '../../../../store/main/articles/actions'

import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';
import { Bold, Italic, Underline } from '@ckeditor/ckeditor5-basic-styles';
import { Link as CkLink } from '@ckeditor/ckeditor5-link';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import Subscript from '@ckeditor/ckeditor5-basic-styles/src/subscript';
import Superscript from '@ckeditor/ckeditor5-basic-styles/src/superscript';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { updateArticleRevision } from 'store/main/articlesRevision/actions';

const RevisionAbstract = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    let { articleId } = useParams();

    const articleInfo = useSelector((state) => state.articleRevision.single);
    const selectedArticleType = useSelector((state) => state.articleType.selected);

    const [editorData, setEditorData] = useState(articleInfo?.articleRevision_data_id?.abstract ?? '');

    useEffect(() => {
        setEditorData(articleInfo?.abstract ?? '')
    }, [articleInfo?.abstract])

    const {
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm({ reValidateMode: 'onChange' });

    useEffect(() => {
        reset();
    }, [articleInfo]);

    const handleArticleData = (data) => {
        setEditorData(data)
    }

    const updateDraftArticleHandle = (formData) => {
        dispatch(
            updateArticleRevision({
                body: { "abstract": editorData },
                options: { id: articleId, btnLoader: true, __module: 'articleRevision', showToast: true },
            }));
        navigate(`/main/article/${articleId}/revision/keyword`);
    }

    return (
        <>
            {
                (length >= 0) && <div className="col-lg-9">
                    <section className="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
                        <div className="card-body">
                            <form onSubmit={handleSubmit(updateDraftArticleHandle)}>
                                <div className="row g-3 g-sm-4">
                                    <div className="col-sm-12">
                                        <div className="text-center text-lg-start ">
                                            <h3 className="h3 mb-4">
                                                Abstract
                                            </h3>
                                            <p>
                                                Common questions:
                                                How do I format my citations?
                                                What about sub-headers?
                                            </p>
                                            <div className="pb-3">
                                                {articleInfo && <CKEditor
                                                    editor={ClassicEditor}
                                                    config={{
                                                        plugins: [Essentials, Bold, Italic, Subscript, Superscript, Underline, CkLink, Paragraph],
                                                        toolbar: [ 'bold', 'italic', 'Subscript', 'Superscript'],
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
                                                />}
                                                <div className="invalid-feedback">{errors.abstract?.message}</div>
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
                </div>
            }
        </>
    );
};

export default RevisionAbstract;