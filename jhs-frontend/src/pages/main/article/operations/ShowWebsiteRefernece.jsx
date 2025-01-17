/* eslint-disable */
import moment from 'moment';
import React from 'react';

const ShowWebsiteReference = ({ reference, position }) => {

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
                            <span className="fw-bold fs-6 "><i className="ai-globe me-1" />Website</span>
                        </div>
                    </div>
                    <h4 className="h6 mb-1">
                        {reference?.title ? reference.title : <div className='text-danger'>Untitled Reference</div>}
                    </h4>
                    <div className="text-muted fw-small d-flex flex-wrap flex-sm-nowrap align-items-center">
                            <i className="ai-web me-1" />
                            {reference?.doi ? reference.doi : (reference?.url ? <a href={reference.url}>{reference.url}</a> : <div className='text-danger'>Missing DOI or URL</div>)}
                    </div>
                    <div className="text-muted fw-small d-flex flex-wrap flex-sm-nowrap align-items-center">
                        <div className="d-flex align-items-center text-nowrap">
                            <i className="ai-calendar me-1" />
                            <span className="fw-bold">Access Date:{' '}</span>{`${moment(reference?.accessDate)?.format("LL")}`}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShowWebsiteReference;