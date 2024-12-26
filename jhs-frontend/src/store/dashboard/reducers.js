/* eslint-disable */
const initial = {
    totalAssets: null,
    referrals: null,
    recentTransactions: [],
    recentOrders: [],
};
export const dashboardReducer = (state = initial, action) => {
    switch (action.type) {
        case 'SET_TOTAL_ASSETS':
         // api 

            return {
                ...state,
                totalAssets: action.payload,
            };
        case 'GET_USER_ASSETS_OVERVIEW':
                return {
                    ...state,
                    totalAssets: action.payload.totalAssets,
                };
        case 'GET_USER_TRANSACTIONS':
            return {
                ...state,
                recentTransactions: action.payload.transactions,
            };
        case 'GET_EXCH_ORDERS':
            return {
                ...state,
                recentOrders: action.payload.orders,
            };
        case 'SET_RECENT_TRANSACTIONS':
            return {
                ...state,
                recentTransactions: action.payload,
            };
        case 'SET_RECENT_ORDERS':
            return {
                ...state,
                recentOrders: action.payload,
            };
        case 'SET_REFERRALS':
            return {
                ...state,
                referrals: action.payload,
            };

        default:
            return state;
    }
};
