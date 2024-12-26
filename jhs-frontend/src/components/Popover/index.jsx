import React from 'react';

const Popover = ({ children, id = 'popperId', className = 'popover', top = 0, left = 0 }) => {

    return (
        <div
            className="popover bs-popover-start bs-popover-start-demo mt-2"
            role="presentation"
            style={{
                position: 'absolute',
                zIndex: 1000,
                left: left,
                top: top
            }}
        >
            <h3 className="popover-header">Operation</h3>
            <div className="popover-body">
                {children}
            </div>
        </div>
    );
};

export default Popover;