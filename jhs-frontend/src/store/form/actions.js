/* eslint-disable */
export const setFormErrors = (payLoad) => async (dispatch) => {
    dispatch({ type: 'SET_FORM_ERRORS', payload: payLoad });
};
export const resetFormErrors = () => (dispatch) => {
    dispatch({ type: 'RESET_FORM_ERRORS' });
};
