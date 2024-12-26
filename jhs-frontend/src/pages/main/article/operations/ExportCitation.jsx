/* eslint-disable */
import React from 'react';

import { toggleModal } from 'helpers/globalHelpers';

const ExportCitation = ({ articleId, ActionType = 'dropdown' }) => {
        const handleAction = () => {
                toggleModal('#showArticleCitationModel')
        };

        const type = ActionType === 'dropdown' ? 'dropdown-item' : ActionType;

        return (
                <div>
                        <button
                                key={`exportCitation` + articleId}
                                id={`exportCitation` + articleId}
                                className={`${type}`} onClick={() => handleAction()}>
                                <i className="ai-download me-2"></i> Export Citation
                        </button>
                </div>
        );
};

export default ExportCitation;