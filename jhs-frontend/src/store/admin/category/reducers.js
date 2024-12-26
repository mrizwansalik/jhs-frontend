/* eslint-disable */
const initial = {
    list:null,
    single:null,
};
export const categoryReducer = (state = initial, action) => {
    switch (action.type) {
        case 'SET_CATEGORIES':
          return {
                ...state,
                list: action.payload,
            };
        case 'SET_CATEGORY':
                return {
                    ...state,
                    single: action.payload,
                };
        case 'SET_CATEGORY_STATUS':
            const index = state.list.findIndex(categories => categories._id === action.payload._id);
            const newArray = [...state.list];
            newArray[index].active = action.payload.active;
            return {
                ...state,
                list: newArray,
            };
        default:
            return state;
    }
};
