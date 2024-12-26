/* eslint-disable react/button-has-type */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { useSelector } from 'react-redux';

const Button = (props) => {
    const loading = useSelector((state) => state.general.btnLoading);
    return (
        <button
            disabled={props.disabled !== 'undefined' ? props.disabled : loading}
            type={props.type}
            className={props.className}>
            {loading && <span className="spinner-border text-light" role="status" aria-hidden="true" />}
            {!loading && <span>{props.title}</span>}
            {loading && <span> &nbsp;Loading...</span>}
        </button>
    );
};

export default Button;
