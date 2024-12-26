/* eslint-disable */
const initial = {
    limit: 10,
    status: null,
    orderBy: null,
};
export const filtersReducer = (state = initial, action) => {
    switch (action.type) {
        case 'SET_FILTERS':
            return {
                ...state,
                ...action.payload,
            };
        case 'RESET_FILTER':
            return {
                limit: initial.limit,
                status: initial.status,
                orderBy: initial.orderBy,
            };
        case 'REMOVE_FILTER':
            return state.filter((item) => item.id != action.payload.id);

        default:
            return state;
    }
};
