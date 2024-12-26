/* eslint-disable */
const initial = {
    list:null,
    single:null,
    search:null,
    publicUser:null
};
export const referenceReducer = (state = initial, action) => {
    switch (action.type) {
        case 'SET_REFERENCE_LIST':
          return {
                ...state,
                list: action.payload,
            };
        default:
            return state;
    }
};
