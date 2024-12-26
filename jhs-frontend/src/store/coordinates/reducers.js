/* eslint-disable */
const initial = {
    latitude: null,
    longitude: null,
};
export const coordinatesReducer = (state = initial, action) => {
    switch (action.type) {
        case 'SET_COORDINATES':
            return {
                ...state,
                latitude: action.payload.latitude,
                longitude: action.payload.longitude,
            };
        default:
            return state;
    }
};
