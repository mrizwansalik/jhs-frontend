/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import UpdateButton from '../../../../components/button/Button';
import { getPublicCategories } from 'store/admin/category/actions';
import { updateArticleLanguageCorrection } from 'store/main/articlesLanguageCorrection/actions';

const LanguageCorrectionCategory = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let { articleId } = useParams();
    const articleInfo = useSelector((state) => state.articleLanguageCorrection.single);
    const categoryList = useSelector((state) => state.category.list);
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        if (articleInfo?.category) {
            setSelectedCategories(articleInfo.category.map(cat => cat)); // Assuming `category` is an array of category IDs
        }
    }, [articleInfo]);

    const handleCheckboxChange = (id) => {
        if (selectedCategories.includes(id)) {
            // Remove if already selected
            setSelectedCategories(selectedCategories.filter((catId) => catId !== id));
        } else if (selectedCategories.length < 3) {
            // Add if less than 3 are selected
            setSelectedCategories([...selectedCategories, id]);
        }
    };

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm({ reValidateMode: 'onChange' });

    useEffect(() => {
        reset();
    }, [articleInfo]);

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(getPublicCategories({ body: {}, options: { __module: 'category' }}))
    }, [dispatch]);

    const updateArticleLanguageCorrectionHandle = (formData) => {
        dispatch(
            updateArticleLanguageCorrection({
                body: { category: selectedCategories },
                options: { id: articleId, btnLoader: true, __module: 'articleLanguageCorrection', showToast: true },
            }));
        navigate(`/main/article/${articleId}/languageCorrection/abstract`);
    }


    return (
        <div className="col-lg-9">
            {/* Journals list */}
            <section className="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
                <div className="card-body">
                    <form onSubmit={handleSubmit(updateArticleLanguageCorrectionHandle)}>
                        <div className="row g-3 g-sm-4">
                            <div className="col-sm-12">
                                <div className="text-lg-start ">
                                    <h3 className="h3 mb-4">
                                        What categories best describe your article?
                                    </h3>
                                    <p className="pb-2 mb-2">
                                        You can choose up to 3 categories that best represent your article. Selecting the right categories helps others find your work more easily.                                    </p>
                                    <div className="row pb-3 m-3">
                                        {
                                            categoryList?.map((category) => (
                                                <div key={category?._id} className="col-12 col-md-6 col-lg-3 form-check form-check-inline">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id={category?._id}
                                                        checked={selectedCategories.includes(category?._id)}
                                                        onChange={() => handleCheckboxChange(category?._id)}
                                                        disabled={!selectedCategories.includes(category?._id) && selectedCategories.length >= 3} // Disable if 3 are selected
                                                    />
                                                    <label className="form-check-label" htmlFor={category?._id}>
                                                        {category?.name}
                                                    </label>
                                                </div>
                                            ))
                                        }
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
    );
};

export default LanguageCorrectionCategory;