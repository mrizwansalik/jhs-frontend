/* eslint-disable */
const initial = {
    list:null,
    single:null
};
export const servicesReducer = (state = initial, action) => {
    switch (action.type) {
        case 'SET_ALL_SERVICES':
            return {
                ...state,
                list: action.payload,
                // role:action.payload.role
            };
        case 'SET_SERVICES':
            return {
                ...state,
                single: action.payload,
            };
       
        default:
            return state;
    }
};

