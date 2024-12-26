/* eslint-disable */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { checkFeaturePermission, getArticleUserTitle } from 'helpers/globalHelpers';
import { send } from 'config/websocket';

const ArticleCommentActions = ({ articleId, comment, article, socket, ActionType = 'dropdown' }) => {

        const MySwal = withReactContent(Swal)

        const dispatch = useDispatch();
        const user = useSelector((state) => state.profile.profile);

        const handleAction = (action) => {
                const swalWithBootstrapButtons = MySwal.mixin({
                        customClass: {
                                
                                confirmButton: 'btn btn-success m-1',
                                cancelButton: 'btn btn-danger m-1'
                        },
                        buttonsStyling: false,
                });
                swalWithBootstrapButtons.fire({
                        title: 'Are you sure?',
                        text: "You won't be able to revert this!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Yes, Do it!',
                        cancelButtonText: 'No, cancel!',
                        confirmButtonColor: 'btn btn-success m-1',
                        cancelButtonColor: 'btn btn-danger m-1',
                        reverseButtons: true
                }).then((result) => {
                        if (result.isConfirmed) {
                                dispatch(send(socket, action, { commentId: comment._id }));
                        } // end if
                });
        };

        let permissions = [];
        if (article?.authorList.map(author => author?._id ? author?._id : author).includes(user?._id) || article?._author?._id === user?._id || article?._author === user?._id) {
                permissions.push('Author');
        } else if (article?.reviewerList.map(reviewer => reviewer?._id ? reviewer?._id : reviewer).includes(user?._id)) {
                permissions.push('Reviewer');
        } else if (article?.assignedTo?.id === user?._id || article?.assignedTo === user?._id) {
                permissions.push('Reviewer');
        } else {
                if (checkFeaturePermission('article-changestatus')) {
                        permissions.push('Editor');
                }
        }

        const type = ActionType === 'dropdown' ? 'dropdown-item' : ActionType;

        let commentUserInfo = getArticleUserTitle(comment?.addBy);

        return (
                <>
                        {
                                (user?._id == comment?.addBy && comment?.isCompleted == false && comment?.isClosed == false) ?
                                        <button
                                                key={`completeArticleComment` + comment._id}
                                                id={`completeArticleComment` + comment._id}
                                                className={`${type}`} onClick={() => handleAction(`MARK_COMMENT_AS_COMPLETE`)}>
                                                <i className="ai-check me-2"></i> Mark as Complete
                                        </button>
                                        : ''
                        }
                        {
                                (user?._id == comment?.addBy && comment?.isCompleted == false && comment?.isClosed == false) ?
                                        <button
                                                key={`deleteArticleComment` + comment._id}
                                                id={`deleteArticleComment` + comment._id}
                                                className={`${type}`} onClick={() => handleAction(`MARK_COMMENT_AS_COMPLETE`)}>
                                                <i className="ai-trash me-2"></i> Delete
                                        </button>
                                        : ''
                        }
                        {
                                ((permissions == commentUserInfo || permissions == 'Editor') && user?._id != comment?.addBy && comment?.isCompleted == false && comment?.isClosed == false) ?
                                        <button
                                                key={`closeArticleComment` + comment._id}
                                                id={`closeArticleComment` + comment._id}
                                                className={`${type}`} onClick={() => handleAction(`MARK_COMMENT_AS_CLOSED`)}>
                                                <i className="ai-check me-2"></i> Mark as Closed
                                        </button>
                                        : ''
                        }
                </>
        );
};

export default ArticleCommentActions;