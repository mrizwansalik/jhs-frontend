/* eslint-disable */
import { useNavigate } from 'react-router-dom';

// TODO: Unresolved navigation issue in react-router-dom v6 ==> https://github.com/remix-run/react-router/issues/8264
// Issue: could not navigate out side of react component
// Check if it is resolved or not by the time you see
// Kind of temp solution

export const History = {
    navigate: null,
    push: (page, ...rest) => History.navigate(page, ...rest),
};

export const NavigationSetter = () => {
    History.navigate = useNavigate();
    return null;
};
