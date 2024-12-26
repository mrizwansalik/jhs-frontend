/* eslint-disable */
import React from 'react';
import { useDispatch } from 'react-redux';

import {
        acceptArticleOnSubmission,
        payArticlePayment,
        requestForArticleLanguageCorrection,
        acceptRequestForLanguageCorrection,
        completeLanguageCorrection,
        acceptArticleFromLanguageCheck,
        rejectArticleFromLanguageCheck,
        acceptArticleFromPeerReview,
        rejectArticleFromPeerReview,
        acceptArticleFromGalleryProof,
        requestForRevision,
        approveRequestForRevision,
        rejectRequestForRevision,
        acceptArticleRevision,
        rejectArticleRevision,
        startLanguageCorrection,
        acceptLanguageCorrection,
        reviewLanguageCorrection,
        publishArticle,
        getArticle,
} from '../../../../store/main/articles/actions';
import { useSelector } from 'react-redux';
import { checkFeaturePermission, toggleModal } from 'helpers/globalHelpers';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Link } from 'react-router-dom';
import { getPublicCategories } from 'store/admin/category/actions';

const ArticleActions = ({ taskState, articleId, article, ActionType = 'dropdown' }) => {

        const MySwal = withReactContent(Swal)

        const dispatch = useDispatch();
        const user = useSelector((state) => state.profile.profile);
        let permissions = [];

        const handlePublishAction = () => {
                dispatch(getArticle({ body: {}, options: { id: articleId, btnLoader: true, __module: "article" } }));
                dispatch(getPublicCategories({ body: {}, options: { __module: 'category' }}))
                toggleModal('#showPublishArticleModel')
        };

        const taskActions = {
                'submitted': [
                        { label: 'Accept & Request for Payment', action: acceptArticleOnSubmission, permission: ['article-approve'], status: -1 },
                ],
                'pendingpayment': [
                        { label: 'Pay Payment', action: payArticlePayment, permission: ["author"], status: -1 },
                ],
                'revisionrequest': [
                        { label: 'Accept Revision', action: approveRequestForRevision, permission: ["manager", 'article-approve'], status: -1 },
                        { label: 'Reject Revision', action: rejectRequestForRevision, permission: ["manager", 'article-reject'], status: -1 },
                ],
                'revisionsubmitted': [
                        { label: 'Approve Revision', action: acceptArticleRevision, permission: ["manager", 'article-approve'], status: -1 },
                        { label: 'Reject Revision', action: rejectArticleRevision, permission: ["manager", 'article-reject'], status: -1 },
                ],
                'languagecheck': [
                        { label: 'Approve Language Check', action: acceptArticleFromLanguageCheck, permission: ["manager", 'article-approve'], status: -1 },
                        { label: 'Reject Language Check', action: rejectArticleFromLanguageCheck, permission: ["manager", 'article-reject'], status: -1 },
                        // request for language check
                        { label: 'Request for Language Correction', action: requestForArticleLanguageCorrection, permission: ["author", 'article-reject'], status: 0 },
                ],
                'pendingcorrectionservice': [
                        { label: 'Accept Language Correction Request', action: acceptRequestForLanguageCorrection, permission: ["manager", 'article-approve'], status: -1 },
                        { label: 'Start Language Correction', action: startLanguageCorrection, permission: ["manager", 'article-approve'], status: 0 },
                ],
                'languagecorrectionservice': [
                        { label: 'Complete Language Correction', action: completeLanguageCorrection, permission: ["editor", 'article-changestatus'], status: -1 },
                        { label: 'Accept Language Correction', action: acceptLanguageCorrection, permission: ["manager", 'article-approve'], status: 1 },
                        { label: 'Review Language Correction', action: reviewLanguageCorrection, permission: ["manager", 'article-reject'], status: 1 },
                ],
                'peerreview': [
                        { label: 'Approve Peer Review', action: acceptArticleFromPeerReview, permission: ["reviewer", 'article-approve'], status: -1 },
                        { label: 'Reject Peer Review', action: rejectArticleFromPeerReview, permission: ["reviewer", 'article-reject'], status: -1 },
                ],
                'galleryproofsend': [
                        { label: 'Approve Gallery Proof', action: acceptArticleFromGalleryProof, permission: ["author"], status: -1 },
                ],
        };

        const handleAction = (action) => {
                const swalWithBootstrapButtons = MySwal.mixin({
                        customClass: {
                                confirmButton: 'btn btn-success m-1',
                                cancelButton: 'btn btn-danger m-1'
                        },
                        buttonsStyling: false,
                })
                swalWithBootstrapButtons.fire({
                        title: 'Are you sure?',
                        text: "You won't be able to revert this!",
                        icon: 'warning',
                        input: 'text',
                        inputPlaceholder: "Write something",
                        showCancelButton: true,
                        confirmButtonText: 'Yes, Do it!',
                        cancelButtonText: 'No, cancel!',
                        confirmButtonColor: 'btn btn-success m-1',
                        cancelButtonColor: 'btn btn-danger m-1',
                        reverseButtons: true,
                }).then((result) => {
                        if (result.isConfirmed) {
                                dispatch(action(
                                        {
                                                body: { processingText: result.value ?? '' },
                                                options: { id: articleId, btnLoader: true, __module: 'articleProcessing', showToast: true },
                                        }
                                ));
                        }
                })


        };

        const actions = taskActions[taskState] ?? [];

        if (article?.authorList.map(author => author?._id ? author?._id : author).includes(user?._id) || article?._author?._id === user?._id || article?._author === user?._id) {
                permissions.push('author');
        } else if (article?.reviewerList.map(reviewer => reviewer?._id ? reviewer?._id : reviewer).includes(user?._id)) {
                permissions.push('reviewer');
        } else if (article?.assignedTo?.id === user?._id || article?.assignedTo === user?._id) {
                permissions.push('assignee');
        } else if (article?.managedBy?.id === user?._id || article?.managedBy === user?._id) {
                permissions.push('manager');
        } else if (article?.editors.map(editors => editors?._id ? editors?._id : editors).includes(user?._id)) {
                permissions.push('editor');
        } else {
                if (checkFeaturePermission('article-approve')) {
                        permissions.push('article-approve');
                }
                if (checkFeaturePermission('article-reject')) {
                        permissions.push('article-reject');
                }
                if (checkFeaturePermission('article-changestatus')) {
                        permissions.push('article-changestatus');
                }
                if (checkFeaturePermission('articlepublished-add')) {
                        permissions.push('articlepublished-add');
                }
        }

        const type = ActionType === 'dropdown' ? 'dropdown-item' : ActionType;

        return (
                <div>

                        {
                                (article?.status === 1 && taskState === 'languagecorrectionservice' && permissions.includes("manager")) && type === 'dropdown-item' ?
                                        <Link
                                                key={"article_language_correction_detail_" + article?._id}
                                                id={"article_language_correction_detail_" + article?._id}
                                                className="dropdown-item" to={"/main/article/" + article?._id + "/showArticle/languagecorrection"}>
                                                <i className="ai-list me-2"></i> Langue Correction Details
                                        </Link>
                                        : ''
                        }
                        {
                                (article?.status === -1 && taskState === 'revisionsubmitted' && permissions.includes("manager")) && type === 'dropdown-item' ?
                                        <Link
                                                key={"article_revision_detail_" + article?._id}
                                                id={"article_revision_detail_" + article?._id}
                                                className="dropdown-item" to={"/main/article/" + article?._id + "/showArticle/revision"}>
                                                <i className="ai-list me-2"></i> Revision Details
                                        </Link>
                                        : ''
                        }
                        {
                                (taskState === 'readyforpublish' && (permissions.includes("manager") || permissions.includes("articlepublished-add")) && type === 'dropdown-item' ) ?
                                        <button
                                                key={`publish_article_` + articleId}
                                                id={`publish_article_` + articleId}
                                                className={`${type}`} onClick={() => handlePublishAction()}>
                                                <i className="ai-check me-2"></i> Publish Article
                                        </button>
                                        : ''
                        }
                        {actions.map((actionInfo, index) => (
                                permissions.map((permission, permissionIndex) => (
                                        (actionInfo.permission.includes(permission) && article?.status == actionInfo.status) ?
                                                <button
                                                        key={`${actionInfo.action}` + articleId}
                                                        id={`${actionInfo.action}` + articleId}
                                                        className={`${type}`} onClick={() => handleAction(actionInfo.action)}>
                                                        <i className="ai-checks me-2"></i> {actionInfo.label}
                                                </button>
                                                : ''
                                ))
                        ))}
                        {
                                (article?.isEditable === true && article?.status === -1 && taskState === 'inrevision' && permissions.includes("author")) ?
                                        (
                                                <Link
                                                        key={"article_edit_" + article?._id}
                                                        id={"article_edit_" + article?._id}
                                                        className="dropdown-item" to={"/main/article/" + article?._id + "/revision/title"}>
                                                        <i className="ai-edit me-2"></i> Revise Article
                                                </Link>
                                        ) : (<></>)
                        }
                        {
                                (article?.status === 0 && article?.revised < 2 && taskState !== 'revisionsubmitted' && taskState !== 'revisionrequest' && permissions.includes("author")) ?
                                        <button
                                                key={`requestForRevision` + articleId}
                                                id={`requestForRevision` + articleId}
                                                className={`${type}`} onClick={() => handleAction(requestForRevision)}>
                                                <i className="ai-circle-help me-2"></i> Request for Revision
                                        </button>
                                        : ''
                        }
                        {
                                (article?.languageCorrectionService === false && article?.isLanguageChecked === 0 && permissions.includes("author")) ?
                                        <button
                                                key={`requestForLanguageCorrectionService` + articleId}
                                                id={`requestForLanguageCorrectionService` + articleId}
                                                className={`${type}`} onClick={() => handleAction(requestForArticleLanguageCorrection)}>
                                                <i className="ai-circle-help me-2"></i> Need Help In Language Correction
                                        </button>
                                        : ''
                        }
                        {
                                (article?.isEditable === true && article?.status === -1 && taskState === 'languagecorrectionservice' && permissions.includes("assignee")) ?
                                        (
                                                <Link
                                                        key={"article_edit_" + article?._id}
                                                        id={"article_edit_" + article?._id}
                                                        className="dropdown-item" to={"/main/article/" + article?._id + "/languageCorrection/title"}>
                                                        <i className="ai-edit me-2"></i> Correct Grammar of Article
                                                </Link>
                                        ) : (<></>)
                        }

                  
                </div>
        );
};

export default ArticleActions;