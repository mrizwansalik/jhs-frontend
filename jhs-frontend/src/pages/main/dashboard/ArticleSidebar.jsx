/* eslint-disable */
import React from 'react';

const ArticleSidebar = () => {
    return (
        <div className="card shadow border-1">
            <div className="card-body">
                <h2 className="h6 text-center text-sm-start mb-4">JHS Honors Dashboard</h2>
                <div className="mt-3">
                    <div className="d-flex align-items-center fs-sm text-dark pb-1 mb-2">
                        <span className="ms-2">Scholar</span>
                        <span className="ms-auto">$352</span>
                    </div>
                    <div className="progress" style={{ height: 3 }}>
                        <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: "48%" }}
                            aria-valuenow={48}
                            aria-valuemin={0}
                            aria-valuemax={100}
                        />
                    </div>
                </div>
                <div className="mt-3">
                    <div className="d-flex align-items-center fs-sm text-dark pb-1 mb-2">
                        <span className="ms-2">Magna</span>
                        <span className="ms-auto">$218</span>
                    </div>
                    <div className="progress" style={{ height: 3 }}>
                        <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: "30%" }}
                            aria-valuenow={30}
                            aria-valuemin={0}
                            aria-valuemax={100}
                        />
                    </div>
                </div>
                <div className="mt-3">
                    <div className="d-flex align-items-center fs-sm text-dark pb-1 mb-2">
                        <span className="ms-2">Summa</span>
                        <span className="ms-auto">$97</span>
                    </div>
                    <div className="progress" style={{ height: 3 }}>
                        <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: "14%" }}
                            aria-valuenow={14}
                            aria-valuemin={0}
                            aria-valuemax={100}
                        />
                    </div>
                </div>
                <div className="mt-5">
                    <div className="d-flex align-items-center fs-sm text-muted pb-1 mb-2">
                        <span className="ms-2">Reviewer Rating</span>
                    </div>
                    <div className="d-flex justify-content-start fs-lg mb-4">
                    <i className="ai-star-filled text-warning mx-2" />
                    <i className="ai-star-filled text-warning mx-2" />
                    <i className="ai-star-filled text-warning mx-2" />
                    <i className="ai-star-filled text-warning mx-2" />
                    <i className="ai-star-filled text-warning mx-2" />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ArticleSidebar;