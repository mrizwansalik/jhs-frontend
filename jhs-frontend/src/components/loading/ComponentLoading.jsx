/* eslint-disable consistent-return */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

const ComponentLoading = () => {
    // Data
    const general = useSelector((state) => state.general);

    // Hooks
    useEffect(() => {}, []);

    // Functions

    // JSX
    const showLoading = () => {
        if (general?.isComponentLoading) {
            return (
                <div className="page-loading active">
                    <div className="page-loading-inner">
                    <div className="page-spinner"></div><span>Waiting for Response...</span>
                    </div>
                </div>
            );
        }
    };

    return <>{showLoading()}</>;
};

export default ComponentLoading;
