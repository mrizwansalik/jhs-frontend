/* eslint-disable */
import React from 'react';
import { Navigate } from 'react-router-dom';

import ProfileOverview from './profile';
import ClientLayout from 'layouts/client/ClientLayout';
import Settings from './settings';
import Users from './users';
import AddUserPage from './users/AddUserPage';
import EditUserPage from './users/EditUserPage';

import Permissions from './permissions';
import CreatePermission from './permissions/create';
import UpdatePermission from './permissions/update';

import Roles from './roles';
import CreateRole from './roles/create';
import UpdateRole from './roles/update';

import Journal from './journal';
import UpdateJournal from './journal/update';

import Company from './company';
import UpdateCompany from './company/update';

import ArticleMeta from './articleMeta';
import CreateArticleMeta from './articleMeta/create';
import UpdateArticleMeta from './articleMeta/update';

import ArticleStatus from './articleStatus';
import CreateArticleStatus from './articleStatus/create';
import UpdateArticleStatus from './articleStatus/update';

import Category from './category';
import CreateCategory from './category/create';
import UpdateCategory from './category/update';

import ArticleType from './articleType';
import CreateArticleType from './articleType/create';
import UpdateArticleType from './articleType/update';

import Departments from './department';
import CreateDepartment from './department/create';
import UpdateDepartment from './department/update';

import Services from './services';
import CreateServices from './services/create';
import UpdateServices from './services/update';

import Invoice from './invoice';
import CreateInvoice from './invoice/create';
import UpdateInvoice from './invoice/update';
import ShowInvoice from './invoice/show';

const ClientRoutes = (isLoggedIn) => [
    {
        path: '/system',
        element: isLoggedIn ? <ClientLayout /> : <Navigate to="/login" />,
        children: [
            { path: '', element: <ProfileOverview /> },
        ]
    },
    {
        path: '/system/settings',
        element: isLoggedIn ? <ClientLayout /> : <Navigate to="/login" />,
        children: [
            { path: '', element: <Settings /> },
        ]
    },
    {
        path: '/system/users/',
        element: isLoggedIn ? <ClientLayout /> : <Navigate to="/login" />,
        children: [
            { path: '', element: <Users /> },
            { path: 'add', element: <AddUserPage /> },
            { path: ':userId/edit', element: <EditUserPage /> },
        ]
    },
    {
        path: '/system/permissions/',
        element: isLoggedIn ? <ClientLayout /> : <Navigate to="/login" />,
        children: [
            { path: '', element: <Permissions /> },
            { path: 'create', element: <CreatePermission /> },
            { path: ':permissionId/edit', element: <UpdatePermission /> },
        ]
    },
    {
        path: '/system/roles/',
        element: isLoggedIn ? <ClientLayout /> : <Navigate to="/login" />,
        children: [
            { path: '', element: <Roles /> },
            { path: 'create', element: <CreateRole /> },
            { path: ':roleId/edit', element: <UpdateRole /> },
        ]
    },
    {
        path: '/system/journal/',
        element: isLoggedIn ? <ClientLayout /> : <Navigate to="/login" />,
        children: [
            { path: '', element: <Journal /> },
            { path: 'update', element: <UpdateJournal /> },
        ]
    },
    {
        path: '/system/company/',
        element: isLoggedIn ? <ClientLayout /> : <Navigate to="/login" />,
        children: [
            { path: '', element: <Company /> },
            { path: 'update', element: <UpdateCompany /> },
        ]
    },
    {
        path: '/system/category/',
        element: isLoggedIn ? <ClientLayout /> : <Navigate to="/login" />,
        children: [
            { path: '', element: <Category /> },
            { path: 'create', element: <CreateCategory /> },
            { path: ':categoryId/edit', element: <UpdateCategory /> },
        ]
    },
    {
        path: '/system/articleMeta/',
        element: isLoggedIn ? <ClientLayout /> : <Navigate to="/login" />,
        children: [
            { path: '', element: <ArticleMeta /> },
            { path: 'create', element: <CreateArticleMeta /> },
            { path: ':articleMetaId/edit', element: <UpdateArticleMeta /> },
        ]
    },
    {
        path: '/system/articleStatus/',
        element: isLoggedIn ? <ClientLayout /> : <Navigate to="/login" />,
        children: [
            { path: '', element: <ArticleStatus /> },
            { path: 'create', element: <CreateArticleStatus /> },
            { path: ':articleStatusId/edit', element: <UpdateArticleStatus /> },
        ]
    },
    {
        path: '/system/articleType/',
        element: isLoggedIn ? <ClientLayout /> : <Navigate to="/login" />,
        children: [
            { path: '', element: <ArticleType /> },
            { path: 'create', element: <CreateArticleType /> },
            { path: ':articleTypeId/edit', element: <UpdateArticleType /> },
        ]
    },
    {
        path: '/system/department/',
        element: isLoggedIn ? <ClientLayout /> : <Navigate to="/login" />,
        children: [
            { path: '', element: <Departments /> },
            { path: 'create', element: <CreateDepartment /> },
            { path: ':id', element: <UpdateDepartment />},
        ]
    },
    {
        path: '/system/services/',
        element: isLoggedIn ? <ClientLayout /> : <Navigate to="/login" />,
        children: [
            { path: '', element: <Services /> },
            { path: 'create', element: <CreateServices /> },
            { path: ':servicesId/edit', element: <UpdateServices />},
        ]
    },
    {
        path: '/system/invoice/',
        element: isLoggedIn ? <ClientLayout /> : <Navigate to="/login" />,
        children: [
            { path: '', element: <Invoice /> },
            { path: 'create', element: <CreateInvoice /> },
            { path: ':invoiceId/edit', element: <UpdateInvoice />},
            { path: ':invoiceId/show', element: <ShowInvoice />},
        ]
    },
];

export default ClientRoutes;
