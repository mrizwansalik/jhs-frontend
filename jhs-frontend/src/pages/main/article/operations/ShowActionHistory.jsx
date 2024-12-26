/* eslint-disable */
import React from 'react';

import { toggleModal } from 'helpers/globalHelpers';
import { getArticleActionHistory } from 'store/main/articles/actions';
import { useDispatch } from 'react-redux';

const ShowActionHistory = ({ articleId, ActionType = 'dropdown' }) => {

        const dispatch = useDispatch();

        const handleAction = () => {
                dispatch(
                        getArticleActionHistory({
                            body: {},
                            options: { id: articleId, btnLoader: true, __module: 'article', showToast: false },
                        }));
                toggleModal('#showArticleActionHistoryModel')
        };
        
        const type = ActionType === 'dropdown' ? 'dropdown-item' : ActionType;

        return (
                <div>
                        <button
                                key={`showArticleActionHistory` + articleId}
                                id={`showArticleActionHistory` + articleId}
                                className={`${type}`} onClick={() => handleAction()}>
                                <i className="ai-list me-2"></i> Show Article Action History
                        </button>
                </div>
        );
};

export default ShowActionHistory;