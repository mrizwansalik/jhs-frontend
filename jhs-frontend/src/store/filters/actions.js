/* eslint-disable */
export const createToasts = (data) => (dispatch) => {
    var toastId = Math.floor(Math.random() * 999999);
    dispatch({ type: 'SET_TOAST', payload: { ...data, id: toastId } });
    setTimeout(() => {
        dispatch({ type: 'REMOVE_TOAST', payload: { id: toastId } });
    }, 2000);
};

export const applyFilters = (data) => (dispatch) => {
    dispatch({ type: 'SET_FILTERS', payload: data.filter });
};
export const resetFilter = () => (dispatch) => {
    dispatch({ type: 'RESET_FILTER' });
};
