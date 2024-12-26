/* eslint-disable */
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { checkFeaturePermission } from 'helpers/globalHelpers';

// functions
import { getAllArticleMeta } from '../../../store/admin/articleMeta/actions';

const ArticleMeta = () => {
    const dispatch = useDispatch();
    const articleMeta = useSelector((state) => state.articleMeta.list);
    const permission = useSelector((state)=>state.profile.role);

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({ reValidateMode: 'onChange' });

    useEffect(()=>{
        if(permission && permission.length){
            !checkFeaturePermission('articlemeta-view') && navigate('/not-found');
        }
    },[permission]);
    
    useEffect(() => {
        window.scrollTo(0, 0);
        dispatch(
            getAllArticleMeta({
                body: {},
                options: { __module: 'articleMeta' },
            }))
    }, []);
    if(!permission || !articleMeta){
        return '';
    }

    return (
        <>
            <div className="col-lg-9 pt-4 pb-2 pb-sm-4">
                {/* Article Meta list */}
                <section className="card border-0 py-1 p-md-2 p-xl-3 p-xxl-4 mb-4">
                    <div className="card-body">
                        <div className="d-flex align-items-center mt-sm-n1 pb-4 mb-0 mb-lg-1 mb-xl-3">
                            <i className="ai-tag text-primary lead pe-1 me-2" />
                            <h2 className="h4 mb-0">Article Meta Information</h2>
                            {checkFeaturePermission('articlemeta-add') ?
                                <Link className="btn btn-sm btn-secondary ms-auto" to="/system/articleMeta/create">
                                    Add Article meta
                                </Link>
                                : ''}
                        </div>

                        <div className="table-responsive">
                            <table className="table table-hover">
                                <tbody><tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Volume</th>
                                    <th>Year</th>
                                    <th>Issue</th>
                                    <th>Action</th>
                                </tr>
                                </tbody>
                                <tbody>
                                    {articleMeta && articleMeta.map((data, index) => {
                                        return (
                                            <tr key={"tr-" + data._id}>
                                                <th scope="row">{++index}</th>
                                                <td>{data?.name}</td>
                                                <td>{data?.volume}</td>
                                                <td>{data?.year}</td>
                                                <td>{data?.issue }</td>
                                                <td>
                                                    {
                                                        checkFeaturePermission('articlemeta-update') ?
                                                            <Link className="btn btn-primary btn-sm btn-icon mb-2 me-2" to={"/system/articleMeta/" + data._id + "/edit"} data-bs-toggle="tooltip" aria-label="Edit">
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

export default ArticleMeta;