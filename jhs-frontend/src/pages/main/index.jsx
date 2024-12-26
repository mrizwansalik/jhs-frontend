/* eslint-disable */
import React from 'react';
import { Navigate } from 'react-router-dom';

import ArticleInformation from './article/ArticleInformation';
import ArticleProcessing from './article/ArticleProcessing';

import GetStarted from './article/GetStarted';

import Title from './article/edit/Title';
import Abstract from './article/edit/Abstract';
import Keyword from './article/edit/Keyword';

import Author from  "./article/edit/Authors";

import Introduction from './article/edit/Introduction';
import Methodology from './article/edit/Methodology';
import Result from './article/edit/Result';
import Discussion from './article/edit/Discussion';
import Conclusion from './article/edit/Conclusion';
import Acknowledgement from './article/edit/Acknowledgement';
import Disclosure from './article/edit/Disclosure';
import Supplementary from './article/edit/Supplementary';
import CasePresentation from './article/edit/CasePresentation';

import ClientUserLayout from '../../layouts/client/ClientUserLayout';
import CreateArticleLayout from '../../layouts/article/CreateArticleLayout';
import Reference from './article/edit/References';
import Summary from './article/edit/Summary';
import Reviewers from './article/edit/Reviewer';
import Submit from './article/edit/Submit';

import Chat from './dashboard/chat/Chat';
import ClientUserFullLayout from 'layouts/client/ClientUserFullLayout';

import ArticleLayout from '../../layouts/dashboard/ArticleLayout';
import ActiveArticle from './dashboard/ActiveArticle';
import AssignedArticle from './dashboard/AssignedArticle';
import DraftArticle from './dashboard/DraftArticle';
import ArticleDraft from './article/preview/ArticleDraft';

import DashboardLayout from '../../layouts/dashboard/DashboardLayout';
import ReviewArticle from './dashboard/ReviewArticle';
import Metrics from './dashboard/Metrics';
import Task from './dashboard/Task';
import ShowTaskInformation from './task/ShowTaskInformation';
import AddNewTaskInformation from './task/AddNewTaskInformation';
import ArticleProcessingChat from './article/ArticleProcessingChat';
import ParagraphTracker from './task/ParagraphTracker';

import RevisionTitle from './article/revise/RevisionTitle';
import RevisionSubmit from './article/revise/RevisionSubmit';
import RevisionSummary from './article/revise/RevisionSummary';
import RevisionReviewers from './article/revise/RevisionReviewer';
import RevisionCasePresentation from './article/revise/RevisionCasePresentation';
import RevisionReference from './article/revise/RevisionReferences';
import RevisionSupplementary from './article/revise/RevisionSupplementary';
import RevisionDisclosure from './article/revise/RevisionDisclosure';
import RevisionAcknowledgement from './article/revise/RevisionAcknowledgement';
import RevisionConclusion from './article/revise/RevisionConclusion';
import RevisionDiscussion from './article/revise/RevisionDiscussion';
import RevisionResult from './article/revise/RevisionResult';
import RevisionMethodology from './article/revise/RevisionMethodology';
import RevisionIntroduction from './article/revise/RevisionIntroduction';
import RevisionKeyword from './article/revise/RevisionKeyword';
import RevisionAbstract from './article/revise/RevisionAbstract';
import ArticleRevisionLayout from 'layouts/article/ArticleRevisionLayout';
import ArticleRevisionInformation from './article/ArticleRevisionInformation';

import LanguageCorrectionTitle from './article/languageCorrection/LanguageCorrectionTitle';
import LanguageCorrectionSubmit from './article/languageCorrection/LanguageCorrectionSubmit';
import LanguageCorrectionSummary from './article/languageCorrection/LanguageCorrectionSummary';
import LanguageCorrectionCasePresentation from './article/languageCorrection/LanguageCorrectionCasePresentation';
import LanguageCorrectionReference from './article/languageCorrection/LanguageCorrectionReferences';
import LanguageCorrectionSupplementary from './article/languageCorrection/LanguageCorrectionSupplementary';
import LanguageCorrectionDisclosure from './article/languageCorrection/LanguageCorrectionDisclosure';
import LanguageCorrectionConclusion from './article/languageCorrection/LanguageCorrectionConclusion';
import LanguageCorrectionDiscussion from './article/languageCorrection/LanguageCorrectionDiscussion';
import LanguageCorrectionResult from './article/languageCorrection/LanguageCorrectionResult';
import LanguageCorrectionMethodology from './article/languageCorrection/LanguageCorrectionMethodology';
import LanguageCorrectionIntroduction from './article/languageCorrection/LanguageCorrectionIntroduction';
import LanguageCorrectionKeyword from './article/languageCorrection/LanguageCorrectionKeyword';
import LanguageCorrectionAbstract from './article/languageCorrection/LanguageCorrectionAbstract';
import ArticleLanguageCorrectionLayout from 'layouts/article/ArticleLanguageCorrectionLayout';
import ArticleLanguageCorrectionInformation from './article/ArticleLanguageCorrectionInformation';
import LanguageCorrectionAcknowledgement from './article/languageCorrection/LanguageCorrectionAcknowledgement';
import PublishedArticles from './dashboard/PublishedArticles';
import Category from './article/edit/Category';
import RevisionCategory from './article/revise/RevisionCategory';
import LanguageCorrectionCategory from './article/languageCorrection/LanguageCorrectionCategory';
import RatingPageLayout from 'layouts/publishedArticle/RatingPageLayout';
import AuthorsRating from './articleRating/AuthorsRating';
import EditorRating from './articleRating/EditorRating';
import Rating from './articleRating/Rating';
import ReviewerRating from './articleRating/ReviewerRating';

const ClientRoutes = (isLoggedIn) => [
    {
        path: '/main/dashboard/',
        element: isLoggedIn ? <ArticleLayout /> : <Navigate to="/login" />,
        children: [
            { path: '', element: <ActiveArticle /> },
            { path: 'article/publish', element: <PublishedArticles /> },
            { path: 'article/assigned', element: <AssignedArticle /> },
            { path: 'article/draft', element: <DraftArticle /> },
        ]
    },
    {
        path: '/published/article/rating/:articleId/',
        element: isLoggedIn ? <RatingPageLayout /> : <Navigate to="/login" />,
        children: [
            { path: 'article', element: <Rating /> },
            { path: 'authors', element: <AuthorsRating /> },
            { path: 'reviewers', element: <ReviewerRating /> },
            { path: 'editor', element: <EditorRating /> },
        ]
    },
    {
        path: '/main/dashboard/review/',
        element: isLoggedIn ? <DashboardLayout /> : <Navigate to="/login" />,
        children: [
            { path: '', element: <ReviewArticle /> },
        ]
    },
    {
        path: '/main/dashboard/task/',
        element: isLoggedIn ? <DashboardLayout /> : <Navigate to="/login" />,
        children: [
            { path: '', element: <Task /> },
        ]
    },
    {
        path: '/main/task/',
        element: isLoggedIn ? <ClientUserLayout /> : <Navigate to="/login" />,
        children: [
            { path: '', element: <AddNewTaskInformation /> },
            { path: 'add', element: <AddNewTaskInformation /> },
            { path: ':taskId/showTask', element: <ShowTaskInformation /> },
            { path: 'paragraph', element: <ParagraphTracker /> },
        ]
    },
    {
        path: '/main/dashboard/metrics/',
        element: isLoggedIn ? <DashboardLayout /> : <Navigate to="/login" />,
        children: [
            { path: '', element: <Metrics /> },
        ]
    },
    {
        path: '/main/article/getStarted',
        element: isLoggedIn ? <ClientUserLayout /> : <Navigate to="/login" />,
        children: [
            { path: '', element: <GetStarted /> },
        ]
    },
    {
        path: '/main/article/:articleId/showArticle/',
        element: isLoggedIn ? <ClientUserLayout /> : <Navigate to="/login" />,
        children: [
            { path: '', element: <ArticleInformation /> },
            { path: 'revision', element: <ArticleRevisionInformation /> },
            { path: 'languageCorrection', element: <ArticleLanguageCorrectionInformation /> },
        ]
    },
    {
        path: '/main/article/:articleId/process/',
        element: isLoggedIn ? <ClientUserFullLayout /> : <Navigate to="/login" />,
        children: [
            { path: '', element: <ArticleProcessing /> },
            { path: 'chat', element: <ArticleProcessingChat /> },
        ]
    },
    {
        path: 'main/article/:articleId/edit/',
        element: isLoggedIn ? <CreateArticleLayout /> : <Navigate to="/login" />,
        children: [
            { path: '', element: <Title /> },
            { path: 'title', element: <Title /> },
            { path: 'category', element: <Category /> },
            { path: 'abstract', element: <Abstract /> },
            { path: 'keyword', element: <Keyword /> },
            { path: 'author', element: <Author /> },
            { path: 'introduction', element: <Introduction /> },
            { path: 'methodology', element: <Methodology /> },
            { path: 'result', element: <Result /> },
            { path: 'discussion', element: <Discussion /> },
            { path: 'conclusion', element: <Conclusion /> },
            { path: 'acknowledgement', element: <Acknowledgement /> },
            { path: 'disclosure', element: <Disclosure /> },
            { path: 'supplementary', element: <Supplementary /> },
            { path: 'reference', element: <Reference /> },
            { path: 'case_presentation', element: <CasePresentation />},
            { path: 'reviewers', element: <Reviewers />},
            { path: 'summary', element: <Summary />},
            { path: 'submit', element: <Submit />},
        ]
    },
    {
        path: 'main/article/:articleId/revision/',
        element: isLoggedIn ? <ArticleRevisionLayout /> : <Navigate to="/login" />,
        children: [
            { path: '', element: <RevisionTitle /> },
            { path: 'title', element: <RevisionTitle /> },
            { path: 'category', element: <RevisionCategory /> },
            { path: 'abstract', element: <RevisionAbstract /> },
            { path: 'keyword', element: <RevisionKeyword /> },
            { path: 'introduction', element: <RevisionIntroduction /> },
            { path: 'methodology', element: <RevisionMethodology /> },
            { path: 'result', element: <RevisionResult /> },
            { path: 'discussion', element: <RevisionDiscussion /> },
            { path: 'conclusion', element: <RevisionConclusion /> },
            { path: 'acknowledgement', element: <RevisionAcknowledgement /> },
            { path: 'disclosure', element: <RevisionDisclosure /> },
            { path: 'supplementary', element: <RevisionSupplementary /> },
            { path: 'reference', element: <RevisionReference /> },
            { path: 'case_presentation', element: <RevisionCasePresentation />},
            { path: 'reviewers', element: <RevisionReviewers />},
            { path: 'summary', element: <RevisionSummary />},
            { path: 'submit', element: <RevisionSubmit />},
        ]
    },
    {
        path: 'main/article/:articleId/languageCorrection/',
        element: isLoggedIn ? <ArticleLanguageCorrectionLayout /> : <Navigate to="/login" />,
        children: [
            { path: '', element: <LanguageCorrectionTitle /> },
            { path: 'title', element: <LanguageCorrectionTitle /> },
            { path: 'category', element: <LanguageCorrectionCategory /> },
            { path: 'abstract', element: <LanguageCorrectionAbstract /> },
            { path: 'keyword', element: <LanguageCorrectionKeyword /> },
            { path: 'introduction', element: <LanguageCorrectionIntroduction /> },
            { path: 'methodology', element: <LanguageCorrectionMethodology /> },
            { path: 'result', element: <LanguageCorrectionResult /> },
            { path: 'discussion', element: <LanguageCorrectionDiscussion /> },
            { path: 'conclusion', element: <LanguageCorrectionConclusion /> },
            { path: 'acknowledgement', element: <LanguageCorrectionAcknowledgement /> },
            { path: 'disclosure', element: <LanguageCorrectionDisclosure /> },
            { path: 'supplementary', element: <LanguageCorrectionSupplementary /> },
            { path: 'reference', element: <LanguageCorrectionReference /> },
            { path: 'case_presentation', element: <LanguageCorrectionCasePresentation />},
            { path: 'summary', element: <LanguageCorrectionSummary />},
            { path: 'submit', element: <LanguageCorrectionSubmit />},
        ]
    },
    {
        path: 'main/article/:articleId/previewDraft',
        element: isLoggedIn ? <ClientUserFullLayout /> : <Navigate to="/login" />,
        children: [
            { path: '', element: <ArticleDraft /> },
        ]
    },

    {
        path: 'main/chat',
        element: isLoggedIn ? <ClientUserLayout /> : <Navigate to="/login" />,
        children: [
            { path: '', element: <Chat /> },
        ]
    },
];

export default ClientRoutes;
