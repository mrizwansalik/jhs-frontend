/* eslint-disable */
const initial = {
    profile: null,
    role: [],
    report: [],

};
export const profileReducer = (state = initial, action) => {
    switch (action.type) {
        case 'SET_PROFILE':
            return {
                ...state,
                profile: action.payload.profile,
                role: action.payload.role.rolePermission
                // role:action.payload.role
            };
        case 'SET_PERSONAL_PROFILE':
            return {
                ...state,
                profile: action.payload,
            };
        case 'UPDATE_ROLE':
            return {
                ...state,
                role: action.payload.rolePermission
            };
        case 'SET_REPORT':
            return {
                ...state,
                report: action.payload
                };
        default:
            return state;
    }
};

