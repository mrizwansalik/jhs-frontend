/* eslint-disable */
const initial = {
    list:null,
    single:null
};
export const rolesReducer = (state = initial, action) => {
    switch (action.type) {
        case 'SET_ROLES':
            return {
                ...state,
                list: action.payload,
                // role:action.payload.role
            };
        case 'SET_ROLE':
            return {
                ...state,
                single: action.payload,
            };
       
        default:
            return state;
    }
};

