/* eslint-disable */
const initial = {
    errors: [],
    errorMessage: null,
};

export const formReducer = (state = initial, action) => {
    switch (action.type) {
        case 'SET_FORM_ERRORS':
            return {
                ...state,
                errors: action?.payload?.data?.errors ?? [],
                errorMessage: action?.payload?.message ?? null,
            };
        case 'RESET_FORM_ERRORS':
            return {
                ...state,
                errors: initial.errors,
                errorMessage: initial.errorMessage,
            };

        default:
            return state;
    }
};
