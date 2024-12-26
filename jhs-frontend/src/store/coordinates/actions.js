export const setCoordinates = (data) => (dispatch) => {
    dispatch({ type: 'SET_COORDINATES', payload: data });
};