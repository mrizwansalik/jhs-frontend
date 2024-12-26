/* eslint-disable */
import React from 'react';

import { useSelector } from 'react-redux';

import Modal from '../../../../components/Modal';

const ArticleAuthorModel = () => {

        const authorList = useSelector((state) => state.article.singleAuthorList);

        return (
                <Modal id={`showArticleAuthorModel`} className='modal-xl'>
                        <Modal.Header className="py-4">
                                <h3 className="fs-5 mb-0"> <i className="ai-user text-primary lead pe-1 me-2" /> Article Author List</h3>
                        <button className="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close" />
                        </Modal.Header>
                        <Modal.Body>
                                <div className="card-body">
                                        {
                                                (authorList?.length !== 0 && authorList !== null) ?
                                                        <div className="table-responsive">
                                                                <table className="table table-hover">
                                                                        <thead>
                                                                                <tr>
                                                                                        <th>#</th>
                                                                                        <th>Name</th>
                                                                                        <th>Email</th>
                                                                                        <th>Occupation</th>
                                                                                        <th>Department</th>
                                                                                        <th>Institute</th>
                                                                                        <th>Country</th>
                                                                                </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                                {
                                                                                        authorList.map((author, index) => (
                                                                                                <tr key={`author_row_${index}`}>
                                                                                                        <th scope="row">{index+1}</th>
                                                                                                        <td>{author.name} {author.isMainAuthor ? <i className="ai-circle-check-filled fs-base text-success ms-2"></i>: `` }</td>
                                                                                                        <td>{author.email}</td>
                                                                                                        <td>{author.occupation}</td>
                                                                                                        <td>{author.department}</td>
                                                                                                        <td>{author.institute}</td>
                                                                                                        <td>{author.country}</td>
                                                                                                </tr>
                                                                                        ))

                                                                                }

                                                                        </tbody>
                                                                </table>
                                                        </div>
                                                        :
                                                        <div
                                                                className="card border-0 bg-secondary mx-auto"
                                                        >
                                                                <div className="card-body">
                                                                        <h4 className="card-title">Not Authors are assigned Yet</h4>
                                                                        <p className="card-text">
                                                                                There were no author assigned to this article. You need to wait for it.
                                                                        </p>
                                                                </div>
                                                        </div>
                                        }

                                </div>
                        </Modal.Body>
                        <Modal.Footer>
                                <button type="button" className="btn btn-secondary w-100 w-sm-auto mb-3 mb-sm-0" data-bs-dismiss="modal">Close</button>
                        </Modal.Footer>
                </Modal>
        );
};

export default ArticleAuthorModel;