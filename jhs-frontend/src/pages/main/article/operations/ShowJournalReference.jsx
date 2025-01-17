/* eslint-disable */
import React from 'react';

const ShowJournalReference = ({ reference, position }) => {



    return (
        <div className="d-md-flex align-items-center">
            <div className="d-sm-flex align-items-center">
                <div className="bg-size-cover bg-position-center flex-shrink-0 text-lg bg-secondary rounded-1 p-2"
                >
                    <div className='h4 fw-normal mb-0 mx-1'>{position}</div>
                </div>
                <div className="pt-3 pt-sm-0 ps-sm-3">
                    <div className="fw-small d-flex flex-wrap flex-sm-nowrap align-items-center">
                        <div className="d-flex align-items-center me-3 text-capitalize">
                            Journal
                        </div>
                        <div className="d-flex align-items-end me-3">
                            <i className="ai-web me-1" />
                            {reference?.doi ? reference.doi : (reference?.url ? reference.url : <div className='text-danger'>Missing DOI or URL</div>)}
                        </div>
                    </div>
                    <h4 className="h6 mb-1">
                        {reference?.title ? reference.title : <div className='text-danger'>Untitled Reference</div>}
                    </h4>
                    <div className="text-muted fw-small d-flex flex-wrap flex-sm-nowrap align-items-center">
                        <div className="d-flex align-items-center me-3">
                            <i className="ai-user me-1" />
                            {reference?.authors}
                        </div>
                    </div>
                   
                    <div className="fw-small d-flex flex-wrap align-items-center">
                        <div className="d-flex align-items-center me-3 text-capitalize">
                            <span className="h6 mb-1"><i className="ai-file" /> Volume</span>
                        </div>
                        <div className="d-flex align-items-end">
                            {reference?.volume}
                        </div>
                    </div>
                    <div className="fw-small d-flex flex-wrap align-items-center">
                        <div className="d-flex align-items-center me-3 text-capitalize">
                            <span className="h6 mb-1"><i className="ai-file" /> Issue</span>
                        </div>
                        <div className="d-flex align-items-end">
                            {reference?.issue}
                        </div>
                    </div>
                    <div className="fw-small d-flex flex-wrap align-items-center">
                        <div className="d-flex align-items-center me-3 text-capitalize">
                            <span className="h6 mb-1"><i className="ai-file" /> Pages</span>
                        </div>
                        <div className="d-flex align-items-end">
                            {reference?.pages}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShowJournalReference;