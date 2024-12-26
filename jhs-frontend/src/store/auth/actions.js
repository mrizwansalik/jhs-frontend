/* eslint-disable */
import { History } from '../../routes/NavigationSetter';
import { request } from '../../helpers/request';

export const sendOtp = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', 'send-otp', payload.body, payload.options);
    if (response.status === 200) {
        localStorage.setItem('auth', JSON.stringify({ loginFlow: 'verify-email', authenticated: false }));
        dispatch({
            type: 'SEND_OTP',
            payload: { email: payload.body.value, authenticated: false },
        });
    }
};

export const register = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', 'signup', payload.body, payload.options);
    if (response.status === 200) {
        const userData = {
            id: response?.data._id,
            first_name: response?.data.first_name,
            last_name: response?.data.last_name,
            email: response?.data.email,
            phone: response?.data.phone,
            status: response?.data.status,
            user_type: response?.data.user_type_id,
            roles: response?.data.roles,
        };
        localStorage.setItem('auth', JSON.stringify({ user: userData, authenticated: true }));

        dispatch({
            type: 'AUTH',
            payload: { user: userData, authenticated: true },
        });
    }
};

export const login = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', 'login', payload.body, payload.options);
    if (response.status === 200) {
        const userData = {
            id: response?.data?._id
            // first_name: response?.data.user.first_name,
            // last_name: response?.data.user.last_name,
            // email: response?.data.user.email,
            // phone: response?.data.user.phone,
            // status: response?.data.user.status,
            // user_type: response?.data.user.user_type_id,
            // roles: response?.data.user.roles,
        };
        localStorage.setItem('auth', JSON.stringify({ user: userData, authenticated: true }));
        
        dispatch({
            type: 'AUTH',
            payload: { user: userData, authenticated: true },
        });
    }
};

export const changePassword = (payload) => async (dispatch) => {

   
    const response = await request.makeRequest('POST', 'password/reset', payload.body, payload.options);
    if (response.status === 200) {
        History.push('/login');
    }
};


export const AlreadyLoggedIn = (sessionData) => (dispatch) => {
    dispatch({ type: 'AUTH', payload: { sessionData } });
};

export const logout = () => (dispatch) => {
    localStorage.removeItem('auth');
    localStorage.removeItem('accessToken');
    dispatch({ type: 'AUTH', payload: { user: null, authenticated: false } });
    location.reload();
};

export const resetPassword = (payload) => async () => {
    payload.body.reference_url = "http://localhost:3000/change-password/"
    const response = await request.makeRequest('POST', 'password/recover', payload.body, payload.options);
    if (response.status === 200) {
        History.push('/login');
    }
};

export const resetAuth = () => (dispatch) => {
    dispatch({ type: 'RESET_AUTH' });
};
