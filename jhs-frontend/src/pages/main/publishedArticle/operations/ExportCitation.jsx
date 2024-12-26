/* eslint-disable */
import React from 'react';

import { toggleModal } from 'helpers/globalHelpers';

const ExportCitation = ({ articleId, ActionType = 'dropdown' }) => {
        const handleAction = () => {
                toggleModal('#showPublishedArticleCitationModel')
        };

        const type = ActionType === 'dropdown' ? 'dropdown-item' : ActionType;

        return (
                <button
                        key={`exportCitation` + articleId}
                        id={`exportCitation` + articleId}
                        className={`${type}`} onClick={() => handleAction()}>
                        <i className="ai-planet me-2"></i> Export Citation
                </button>
        );
};

export default ExportCitation;