/* eslint-disable */
const initial = {
    user: null,
    email: null,
    otp: false,
    authenticated: false,
    data: null,
    qrId:null
};
export const loginReducer = (state = initial, action) => {
    switch (action.type) {
        case 'SEND_OTP':
            return {
                ...state,
                email: action.payload.email,
                otp: true,
            };
        case 'RESET_OTP':
            return {
                ...state,
                otp: false,
                email:null,
            };
        case 'VERIFY_OTP':
            return {
                ...state,
                data: action.payload.data,
            };
        case 'AUTH':
            return {
                ...state,
                user: action.payload.user,
                authenticated: action.payload.authenticated,
            };
        case 'POST_SCAN_QR_CODE_RESPONSE':
            if(action.payload.user){
           localStorage.setItem('auth', JSON.stringify({ user:action.payload.user , authenticated: true }));
            }
            return {
                ...state,
                user: action.payload.user,
                authenticated: action.payload.authenticated,
            };
        case 'GET_GEN_QR_CODE':
            return {
                ...state,
                qrId:action.payload.qrId
            };
        case 'RESET_AUTH':
            return {
                user: initial.user,
                email: initial.email,
                otp: initial.otp,
                authenticated: initial.authenticated,
                data: initial.data,
            };
        default:
            return state;
    }
};
export const logoutReducer = (state = null, action) => {
    if (action.type === 'LOGOUT') {
        localStorage.removeItem('auth');
        return state;
    }
    return state;
};
