/* eslint-disable */
import React from 'react';

import { downloadPDF } from 'store/home/publishedArticle/actions';
import { useDispatch } from 'react-redux';

const DownloadPDF = ({ articleId, articleView, ActionType = 'dropdown' }) => {
        const dispatch = useDispatch();

        const handleAction = () => {
                dispatch(
                        downloadPDF({
                                body: {},
                                options: { id: articleId, btnLoader: true, __module: "home", coordinates: true },
                        })
                );
        };

        const type = ActionType === 'dropdown' ? 'dropdown-item' : ActionType;

        return (
                <button
                        key={`downloadUploadPDFModel` + articleId}
                        id={`downloadUploadPDFModel` + articleId}
                        className={`${type}`} onClick={() => handleAction()}>
                        <i className="ai-download fs-sm opacity-90 me-2" />{" "}
                        {type === 'dropdown-item' ? 'Download PDF File' : articleView ?? "0"}
                </button>
        );
};

export default DownloadPDF;