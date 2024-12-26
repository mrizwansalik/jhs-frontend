/* eslint-disable */
const initial = {
    list: [],
    single: [],
};
export const taskReducer = (state = initial, action) => {
    switch (action.type) {
        case 'SET_TASKS_LIST':
            return {
                ...state,
                list: action.payload,
            };
        case 'SET_MY_TASK':
            return {
                ...state,
                single: action.payload,
            };
        default:
            return state;
    }
};
