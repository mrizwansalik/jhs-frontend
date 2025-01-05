/* eslint-disable */
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import { loginReducer, logoutReducer } from './auth/reducers';
import { toastReducer } from './notifications/reducers';
import { generalReducer } from './general/reducers';
import { filtersReducer } from './filters/reducers';

import { userReducer } from './admin/user/reducers'
import { profileReducer } from './profile/reducers'
import { permissionsReducer } from './admin/permissions/reducers';
import { rolesReducer } from './admin/roles/reducers';
import { journalReducer } from './admin/journal/reducers';
import { companyReducer } from './admin/company/reducers';
import { articleStatusReducer } from './admin/articleStatus/reducers';
import { articleMetaReducer } from './admin/articleMeta/reducers';
import { articleTypeReducer } from './admin/articleType/reducers';
import { departmentReducer } from './admin/department/reducers';
import { accountTypesReducer, accountsReducer } from './assets/reducers';

import { articleReducer } from './main/articles/reducers'
import { authorReducer } from './main/author/reducers'
import { referenceReducer } from './main/reference/reducers';

// import { clientOrdersReducer } from "./orders/reducers";

import { dashboardReducer } from './dashboard/reducers';

import { formReducer } from './form/reducers';
import { reviewerReducer } from './main/reviewer/reducers';
// import { chatReducer } from './main/chat/reducers';
import { chatReducer } from './chat/reducers';
//Socket Reducers

import { ChatSocketReducer, NotificationSocketReducer, articleDiscussionSocketReducer, articleProcessingReducer } from './socket/reducers';
import { servicesReducer } from './admin/services/reducers';
import { invoiceReducer } from './admin/invoice/reducers';
import { articleUserReducer } from './main/articleUser/reducers';
import { taskReducer } from './main/task/reducers';
import { articleDiscussionReducer } from './main/articleDiscussion/reducers';
import { articleRevisionReducer } from './main/articlesRevision/reducers';
import { articleLanguageCorrectionReducer } from './main/articlesLanguageCorrection/reducers';
import { publishedArticleReducer } from './main/publishedArticles/reducers';
import { homeReducer } from './home/publishedArticle/reducers';
import { coordinatesReducer } from './coordinates/reducers';
import { categoryReducer } from './admin/category/reducers';
import { homeAuthorReducer } from './home/author/reducers';
import { articleRatingListReducer } from './admin/articleRatingList/reducers';

const reducers = combineReducers({
    auth: loginReducer,
    logout: logoutReducer,

    toasts: toastReducer,
    general: generalReducer,
    filters: filtersReducer,
    coordinates: coordinatesReducer,
    
    accountTypes: accountTypesReducer,
    accounts: accountsReducer,
    dashboard: dashboardReducer,
    form: formReducer,
    user: userReducer,

    profile: profileReducer,
    permissions: permissionsReducer,
    roles: rolesReducer,

    services: servicesReducer,
    invoice: invoiceReducer,
    journals: journalReducer,
    companies: companyReducer,
    departments: departmentReducer,
    category: categoryReducer,
    articleRatingList: articleRatingListReducer,

    articleStatus: articleStatusReducer,
    articleMeta: articleMetaReducer,
    articleType: articleTypeReducer,

    article: articleReducer,
    publishedArticle: publishedArticleReducer,
    author: authorReducer,
    reference: referenceReducer,
    reviewer: reviewerReducer,
    articleUser: articleUserReducer,
    
    articleRevision: articleRevisionReducer,
    articleLanguageCorrection: articleLanguageCorrectionReducer,

    task: taskReducer,

    chat: chatReducer,
    chatSocket: ChatSocketReducer,

    articleProcessingSocket: articleProcessingReducer,

    articleDiscussion: articleDiscussionReducer,
    articleDiscussionSocket: articleDiscussionSocketReducer,

    notificationSocket: NotificationSocketReducer,

    home: homeReducer,
    homeAuthor: homeAuthorReducer
});

export const store = createStore(reducers, composeWithDevTools(applyMiddleware(thunk)));
