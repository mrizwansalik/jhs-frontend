// import react from '@vitejs/plugin-react';
import MainLayout from '../../layouts/MainLayout';
import HomePage from './HomePage';

import ViewArticle from '../main/publishedArticle/ViewArticle';
import ViewArticleAuthor from 'pages/main/publishedArticle/ViewArticleAuthor';
import ViewArticleMedia from 'pages/main/publishedArticle/ViewArticleMedia';
import ShowPublishedArticle from 'layouts/publishedArticle/ShowPublishedArticle';
import ViewArticleReferences from 'pages/main/publishedArticle/ViewArticleReferences';
import ViewArticleMetrics from 'pages/main/publishedArticle/ViewArticleMetrics';
import ArticleListing from './article/ArticleListing';
import AuthorListing from './authors/AuthorListing';
import ShowPublishedAuthor from 'layouts/publicAuthor/ShowPublishedAuthor';
import ViewSingleAuthorCollaboration from './authors/ViewSingleAuthorCollaboration';
import AuthorPublication from './authors/AuthorPublication';
import ViewSingleAuthorStats from './authors/ViewSingleAuthorStats';
import ViewSingleAuthorReview from './authors/ViewSingleAuthorReview';
import ViewArticleRating from 'pages/main/publishedArticle/ViewArticleRating';

const routes = [
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { path: '', element: <HomePage /> },
            { path: 'articles', element: <ArticleListing /> },
            { path: 'authors', element: <AuthorListing /> }
        ],
    },
    {
        path: '/published/article/:articleId/view',
        element: <ShowPublishedArticle />,
        children: [
            { path: '', element: <ViewArticle /> },
            { path: 'rating', element: <ViewArticleRating /> },
            { path: 'authors', element: <ViewArticleAuthor /> },
            { path: 'metrics', element: <ViewArticleMetrics /> },
            { path: 'media', element: <ViewArticleMedia /> },
            { path: 'references', element: <ViewArticleReferences /> },
            
        ]
    },
    {
        path: '/published/author/:authorId/view',
        element: <ShowPublishedAuthor />,
        children: [
            { path: '', element: <AuthorPublication /> },
            { path: 'collaborations', element: <ViewSingleAuthorCollaboration /> },
            { path: 'reviews', element: <ViewSingleAuthorReview /> },
            { path: 'stats', element: <ViewSingleAuthorStats /> },
        ]
    },
];
export default routes;
