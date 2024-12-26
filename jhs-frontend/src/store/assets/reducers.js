/* eslint-disable */
const initial = {
    list: null,
    single: null,
    activeAccountTypeSlug: null,
    pagination: null,
};
export const accountTypesReducer = (state = initial, action) => {
    switch (action.type) {
        // api
        case 'SET_ACCOUNT_TYPES':
            return {
                ...state,
                list: action.payload.data.accountTypes,
                pagination: action.payload.pagination,
            };
        case 'SET_ACTIVE_ACCOUNT_TYPE_SLUG':
            return {
                ...state,
                activeAccountTypeSlug: action.payload,
            };

             // socket        
        case 'GET_USER_ACCOUNTS_TYPES':
            return {
                ...state,
                list: action.payload.accountTypes,
                pagination: action.payload.pagination,
            };

        default:
            return state;
    }
};

export const accountsReducer = (state = initial, action) => {
    switch (action.type) {
        // api
        case 'SET_ACCOUNTS':
            return {
                ...state,
                activeSlug: action.payload.data,
                list: action.payload.data.accounts,
                pagination: action.payload.pagination,
            };

         // socket   
        case 'GET_USER_ACCOUNTS':
            return {
                ...state,
                activeAccountTypeSlug: action.payload,
                activeSlug: action.payload,
                list: action.payload.accounts,
                pagination: action.payload.pagination,
            };
        default:
            return state;
    }
};
