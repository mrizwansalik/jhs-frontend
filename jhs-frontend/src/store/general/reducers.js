/* eslint-disable */
const initial = {
    isLoading: null,
    isComponentLoading: null,
    tradingWidget: null,
    btnLoading: false,
    errors: null,
    errprResponse:undefined
};

export const generalReducer = (state = initial, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload,
            };
        case 'SET_COMPONENT_LOADING':
            return {
                ...state,
                isComponentLoading: action.payload,
            };
        case 'SET_BTN_LOADER':
            return {
                ...state,
                btnLoading: action.payload,
            };
        case 'REMOVE_BTN_LOADER':
            return {
                ...state,
                btnLoading: false,
            };
        case 'SET_ERRORS':
            return {
                ...state,
                errors: action.payload,
            };
        case 'SET_TV_WIDGET':
            return {
                ...state,
                tradingWidget: action.payload,
            };
        case 'SET_ERR_RESPONSE':
            return {
                ...state,
                errprResponse: action.payload,
            };

        default:
            return state;
    }
};
