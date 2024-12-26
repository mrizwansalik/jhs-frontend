import React from 'react';

export const ToolTip = (props) => {
    return (
        <input
            className="form-control custm-value-field pe-8"
            type="text"
            placeholder="Amount"
            data-bs-container="body"
            data-bs-toggle="popover"
            data-bs-trigger="hover "
            data-bs-placement="top"
            data-bs-content="Top popover"
        />
    );
};
