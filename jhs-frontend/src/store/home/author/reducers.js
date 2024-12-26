
/* eslint-disable */
const initial = {
    list: [],
    single: null,
    pagination: null,
};
export const homeAuthorReducer = (state = initial, action) => {
    switch (action.type) {
        case 'SET_HOME_AUTHORS':
            return {
                ...state,
                list: action.payload.data,
                pagination:action.payload.pagination
            };
        case 'SET_HOME_SINGLE_AUTHOR':
            return {
                ...state,
                single: action.payload,
            };
        case 'RESET_HOME_SINGLE_AUTHOR':
            return {
                ...state,
                single: null,
            };
        default:
            return state;
    }
};
