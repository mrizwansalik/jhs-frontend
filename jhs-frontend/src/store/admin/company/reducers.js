/* eslint-disable */
const initial = {
    single: null,
    list: null
};
export const companyReducer = (state = initial, action) => {
    switch (action.type) {
        case 'SET_COMPANY':
            return {
                ...state,
                single: action.payload,
            };
        case 'POST_COMPANY':
            return {
                ...state,
                single: action.payload,
            };
        default:
            return state;
    }
};

