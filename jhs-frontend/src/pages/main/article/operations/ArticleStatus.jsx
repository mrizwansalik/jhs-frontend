/* eslint-disable */
import React from 'react';

const ArticleStatusName = ({ taskState, article }) => {
        let status = "";

        switch (taskState) {
                case 'draft':
                        status = <><i className="ai-bookmark fs-lg opacity-90 me-2" />Draft</>;
                        break;
                case 'submitted':
                        status = (article.status === -1) ? <><strong className='text-primary'><i className="ai-clock fs-lg opacity-90 me-2" />Pending Approval</strong></> : <><strong className='text-danger'><i className="ai-cross-alt fs-lg opacity-90 me-2" />Rejected </strong></>;
                        break;
                case 'pendingpayment':
                        status = (article.payment === -1) ? <><strong className='text-primary'><i className="ai-clock fs-lg opacity-90 me-2" />Pending Payment</strong></> : <><strong className='text-danger'><i className="ai-cross-alt fs-lg opacity-90 me-2" />Payment Rejected</strong></>;
                        break;
                case 'languagecheck':
                        status = (article.status === -1) ? <><strong className='text-primary'><i className="ai-clock fs-lg opacity-90 me-2" />In Language Checked</strong></> : <><strong className='text-danger'><i className="ai-cross-alt fs-lg opacity-90 me-2" />Rejected in Language Checked</strong></>;
                        break;
                case 'revisionrequest':
                        status = (article.status === -1) ? <><strong className='text-warning'><i className="ai-clock fs-lg opacity-90 me-2" />Pending Revision Request</strong></> : <><strong className='text-danger'><i className="ai-cross-alt fs-lg opacity-90 me-2" />Revision Rejected</strong></>;
                        break;
                case 'inrevision':
                        status = (article.status === -1) ? <><strong className='text-primary'><i className="ai-clock fs-lg opacity-90 me-2" />In Revision</strong></> : <><strong className='text-primary'><i className="ai-clock fs-lg opacity-90 me-2" />Revision Submitted</strong></> ;
                        break;
                case 'revisionsubmitted':
                        status = (article.status === -1) ? <><strong className='text-primary'><i className="ai-clock fs-lg opacity-90 me-2" />Pending Revision</strong></> : (article.status === 1) ? <><strong className='text-primary'><i className="ai-clock fs-lg opacity-90 me-2" />Revision Accepted</strong></> : <><strong className='text-danger'><i className="ai-cross-alt fs-lg opacity-90 me-2" />Revision Rejected </strong></> ;
                        break;
                case 'pendingcorrectionservice':
                        status = (article.status === -1) ? <><strong className='text-primary'><i className="ai-clock fs-lg opacity-90 me-2" />Pending Language Correction </strong></> : <><strong className='text-primary'><i className="ai-pen fs-lg opacity-90 me-2" />Ready for Language Correction</strong></>;
                        break;
                case 'languagecorrectionservice':
                        status = (article.status === -1) ? <><strong className='text-primary'><i className="ai-clock fs-lg opacity-90 me-2" />In Language Correction </strong></> : <><strong className='text-primary'><i className="ai-check-alt fs-lg opacity-90 me-2" />Language Correction Completed </strong></>;
                        break;
                case 'peerreview':
                        status = (article.status === -1) ? <><strong className='text-primary'><i className="ai-clock fs-lg opacity-90 me-2" />In Peer Review</strong></> : <><strong className='text-danger'><i className="ai-cross-alt fs-lg opacity-90 me-2" />Rejected in Peer Review</strong></>;
                        break;
                case 'galleryproofsend':
                        status = (article.status === -1) ? <><strong className='text-primary'><i className="ai-clock fs-lg opacity-90 me-2" />Pending Gallery Proof</strong></> : (article.status === 0) ? <><strong className='text-danger'><i className="ai-cross-alt fs-lg opacity-90 me-2" />Gallery Proof Rejected</strong></> : <><strong className='text-success'><i className="ai-award fs-lg opacity-90 me-2" />Ready for Publish</strong></>;
                        break;
                case 'readyforpublish':
                        status = <><strong className='text-success'><i className="ai-award fs-lg opacity-90 me-2" />Ready for Publish</strong></>;
                        break;
                default:
                        status = <><i className="ai-bookmark fs-lg opacity-90 me-2" />Draft</>;
                        break;
        }

        return (
                <>{status}</>
        );
};

export default ArticleStatusName;