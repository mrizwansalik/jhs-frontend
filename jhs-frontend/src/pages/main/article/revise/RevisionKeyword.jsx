/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { TagsInput } from "react-tag-input-component";
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import UpdateButton from '../../../../components/button/Button';
import { updateArticleRevision } from 'store/main/articlesRevision/actions';

const RevisionKeyword = () => {
    const dispatch = useDispatch();
    let { articleId } = useParams();
    const navigate = useNavigate();
    const articleInfo = useSelector((state) => state.articleRevision.single);

    const [selected, setSelected] = useState([]);

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm({ reValidateMode: 'onChange' });

    useEffect(() => {
        reset();
        if(articleInfo?.keywords?.length > 0 ){
            setSelected(articleInfo?.keywords?.map((keyword) => keyword));
        }
    }, [articleInfo]);

    const updateDraftArticleHandle = (formData) => {

        const data = {
            keywords: selected,
        }
        dispatch(
            updateArticleRevision({
                body: { ...data },
                options: { id: articleId, btnLoader: true, __module: 'articleRevision', showToast: true },
            }));
        navigate(`/main/article/${articleId}/revision/introduction`);
    }

    return (
        <div className="col-lg-9">
            <section className="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
                <div className="card-body">
                    <form onSubmit={handleSubmit(updateDraftArticleHandle)}>
                        <div className="row g-3 g-sm-4">
                            <div className="col-sm-12">
                                <div className="text-center text-lg-start ">
                                    <h3 className="h3 mb-4">
                                        Let's add some keywords.
                                    </h3>
                                    <p className="pb-2 mb-2">
                                        Keywords are used to match your manuscript with peer reviewers as well as assist readers in finding the published article. Please add at least five keywords (maximum of 10) and remember to keep them short (a maximum of 3-4 words each) and as specific as possible. Don’t add periods to initialisms or acronyms. Show me examples.
                                    </p>
                                    <p className="pb-2 mb-2">
                                        Note: Additional keywords may be added to your article by our editors.
                                    </p>
                                    <div className="pb-3">
                                        <TagsInput
                                            maxLength={5}
                                            value={selected}
                                            onChange={setSelected}
                                            name="keywords"
                                            placeHolder="Type keyword and hits enter..."
                                        />
                                        <div className="invalid-feedback">Please choose a keyword.</div>
                                        <div className="valid-feedback">Looks good!</div>
                                    </div>
                                    <p className="pb-2 mb-2">
                                        Please add 3 more keywords in order to proceed.
                                    </p>
                                </div>
                            </div>
                            <div className="col-12 d-flex justify-content-end pt-3">
                                <Link className="btn btn-secondary" to='/main/dashboard'>Cancel</Link>
                                <UpdateButton disabled={selected?.length <= 2 ? true : false} className='btn btn-primary ms-3' title="Save & Continue" type='submit' />
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default RevisionKeyword;