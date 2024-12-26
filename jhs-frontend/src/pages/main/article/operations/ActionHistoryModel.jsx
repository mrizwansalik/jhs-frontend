/* eslint-disable */
import React from 'react';

import { useSelector } from 'react-redux';

import moment from "moment";
import Modal from '../../../../components/Modal';

const ActionHistoryModel = () => {

        const articleHistory = useSelector((state) => state.article.singleHistory);

        return (
                <Modal id={`showArticleActionHistoryModel`}>
                        <Modal.Header className="py-4">
                                <h3 className="fs-5 mb-0"> <i className="ai-list text-primary lead pe-1 me-2" /> Article Actions History</h3>
                                <button className="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close" />
                        </Modal.Header>
                        <Modal.Body>
                                <div className="card-body pb-4 mb-4" style={{
                                        overflowY: 'scroll',
                                        maxHeight: '70vh',
                                        scrollBehavior: 'smooth',
                                }}>
                                        {
                                                (articleHistory?.change_status_history_list.length !== 0 && articleHistory !== null) ?
                                                        <div className="mt-2">
                                                                <div className="steps steps-hoverable">
                                                                        {
                                                                                articleHistory.change_status_history_list.map((historyStatus, historyIndex) => (
                                                                                        <div key={`article_history_${historyIndex}`} className="step py-2">
                                                                                                <div className="step-number">
                                                                                                        <div className="step-number-inner">{++historyIndex}</div>
                                                                                                </div>
                                                                                                <div className="step-body">
                                                                                                        <h3 className="h5 pb-1 mb-0">{historyStatus.status}</h3>
                                                                                                        <p className="mb-0">
                                                                                                                {historyStatus.title} - {moment(historyStatus.date)?.format("LLL")}
                                                                                                        </p>
                                                                                                </div>
                                                                                        </div>
                                                                                ))

                                                                        }
                                                                </div>
                                                        </div>
                                                        :
                                                        <div
                                                                className="card border-0 bg-secondary mx-auto"
                                                        >
                                                                <div className="card-body">
                                                                        <h4 className="card-title">Not Processed Yet</h4>
                                                                        <p className="card-text">
                                                                                There were no actions performed on this article. You need to wait for processing on it.
                                                                        </p>
                                                                </div>
                                                        </div>
                                        }

                                </div>
                        </Modal.Body>
                </Modal>
        );
};

export default ActionHistoryModel;