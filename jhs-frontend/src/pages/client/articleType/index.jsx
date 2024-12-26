/* eslint-disable */
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { checkFeaturePermission } from 'helpers/globalHelpers';

// functions
import { getAllArticleType } from '../../../store/admin/articleType/actions';

const ArticleType = () => {
    const dispatch = useDispatch();
    const articleType = useSelector((state) => state.articleType.list);
    const permission = useSelector((state) => state.profile.role);

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({ reValidateMode: 'onChange' });

    useEffect(() => {
        if (permission && permission.length) {
            !checkFeaturePermission('articletype-view') && navigate('/not-found');
        }
    }, [permission]);

    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(
            getAllArticleType({
                body: {},
                options: { __module: 'articleType' },
            }))
    }, []);

    if (!permission || !articleType) {
        return '';
    }

    return (
        <>
            <div className="col-lg-9 pt-4 pb-2 pb-sm-4">
                {/* Article  Type list */}
                <section className="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
                    <div className="card-body">
                        <div className="d-flex align-items-center mt-sm-n1 pb-4 mb-0 mb-lg-1 mb-xl-3">
                            <i className="ai-tag text-primary lead pe-1 me-2" />
                            <h2 className="h4 mb-0">Article Type Information</h2>
                            {checkFeaturePermission('articletype-add') ?
                                <Link className="btn btn-sm btn-secondary ms-auto" to="/system/articleType/create">
                                    Add Article Type
                                </Link>
                                : ''}
                        </div>

                        <div className="table-responsive">
                            <table className="table table-hover">
                                <tbody><tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Elements</th>
                                    <th>Action</th>
                                </tr>
                                </tbody>
                                <tbody>
                                    {articleType && articleType.map((data, index) => {
                                        return (
                                            <tr key={"tr-" + data._id}>
                                                <th scope="row">{++index}</th>
                                                <td>{data?.name}</td>
                                                <td>
                                                    {
                                                        (data?.elements).map(function (element, i) {
                                                            return <span className="badge text-nav fs-xs border text-capitalize mb-1 mx-1" key={data?.name + "-" + element}>{element.replace("_", " ")}</span>
                                                        })
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        checkFeaturePermission('articletype-update') ?
                                                            <Link className="btn btn-primary btn-sm btn-icon" to={"/system/articleType/" + data._id + "/edit"} data-bs-toggle="tooltip" aria-label="Edit">
                                                                <i className="ai-edit"></i>
                                                            </Link> : ''
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>

        </>
    );
};

export default ArticleType;