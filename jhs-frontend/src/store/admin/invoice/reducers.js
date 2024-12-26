/* eslint-disable */
const initial = {
    list:null,
    single:null
};
export const invoiceReducer = (state = initial, action) => {
    switch (action.type) {
        case 'SET_ALL_INVOICE':
            return {
                ...state,
                list: action.payload,
                // role:action.payload.role
            };
        case 'SET_INVOICE':
            return {
                ...state,
                single: action.payload,
            };
       
        default:
            return state;
    }
};

