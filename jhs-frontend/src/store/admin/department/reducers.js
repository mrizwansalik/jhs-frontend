/* eslint-disable */
const initial = {
    list:null,
    single:null,
};
export const departmentReducer = (state = initial, action) => {
    switch (action.type) {
        case 'SET_DEPARTMENTS':
          return {
                ...state,
                list: action.payload,
            };
        case 'SET_DEPARTMENT':
                return {
                    ...state,
                    single: action.payload,
                };
        case 'SET_DEPARTMENT_STATUS':
            const index = state.list.findIndex(departments => departments._id === action.payload._id);
            const newArray = [...state.list];
            newArray[index].active = action.payload.active;
            return {
                ...state,
                list: newArray,
            };
        default:
            return state;
    }
};
