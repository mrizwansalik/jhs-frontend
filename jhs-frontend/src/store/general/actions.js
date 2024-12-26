/* eslint-disable */
import { request } from '../../helpers/request';

export const setLoading = (value) => (dispatch) => {
    dispatch({ type: 'SET_LOADING', payload: value });
};

export const setComponentLoading = (value) => (dispatch) => {
    dispatch({ type: 'SET_COMPONENT_LOADING', payload: value });
};

export const setBtnLoading = (value) => (dispatch) => {
    dispatch({ type: 'SET_BTN_LOADER', payload: value });
    // setTimeout(() => {
    //   dispatch({ type: "REMOVE_BTN_LOADER" });
    // }, 2000);
};

export const setErrors = (payLoad) => async (dispatch) => {
    dispatch({ type: 'SET_ERRORS', payload: payLoad.data.data.errors });
};

export const setTVWidget = (payLoad) => async (dispatch) => {
    dispatch({ type: 'SET_TV_WIDGET', payload: payLoad.tv_widget });
};

