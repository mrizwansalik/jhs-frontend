/* eslint-disable */
import React from "react";

import Modal from "../../../../components/Modal";

const ArticleCommentModel = () => {
        return (
                <Modal id={`showArticleArticleCommentModel`}>
                        <Modal.Header className="py-4">
                                <h3 className="fs-5 mb-0">
                                        {" "}
                                        <i className="ai-comment text-primary lead pe-1 me-2" /> Add Comment
                                        on Article
                                </h3>
                                <button
                                        className="btn-close"
                                        type="button"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                />
                        </Modal.Header>
                        <Modal.Body>
                                <div className="card-body">
                                        <form>
                                                <div className="row g-3 g-sm-4 mt-0 mt-lg-2">
                                                        <div className="col-sm-4">
                                                                <label className="form-label" htmlFor="fn">
                                                                        Text
                                                                </label>
                                                                <textarea
                                                                        className={`form-control is-invalid`}
                                                                        type="text"
                                                                        id="text"
                                                                ></textarea>
                                                                <div className="invalid-feedback"></div>
                                                        </div>
                                                </div>
                                        </form>
                                </div>
                        </Modal.Body>
                        <Modal.Footer>
                                <button
                                        type="button"
                                        className="btn btn-primary w-100 w-sm-auto mb-3 mb-sm-0"
                                        data-bs-dismiss="modal"
                                >
                                        Add Comment
                                </button>
                        </Modal.Footer>
                </Modal>
        );
};

export default ArticleCommentModel;
