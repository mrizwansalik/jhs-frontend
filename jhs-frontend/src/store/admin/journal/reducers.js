/* eslint-disable */
const initial = {
    single: null,
    list: null
};
export const journalReducer = (state = initial, action) => {
    switch (action.type) {
        case 'SET_JOURNAL':
            return {
                ...state,
                single: action.payload,
            };
        case 'POST_JOURNAL':
            return {
                ...state,
                single: action.payload,
            };

        default:
            return state;
    }
};

