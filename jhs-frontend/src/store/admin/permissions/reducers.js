/* eslint-disable */
const initial = {
    list:null,
    single:null,
    pagination:null
};
export const permissionsReducer = (state = initial, action) => {
    switch (action.type) {
        case 'SET_PERMISSIONS':
            return {
                ...state,
                list: action.payload.data,
                pagination:action.payload.pagination
            };
        case 'SET_PERMISSION':
            return {
                ...state,
                single: action.payload,
                // role:action.payload.role
            };
       
        default:
            return state;
    }
};

