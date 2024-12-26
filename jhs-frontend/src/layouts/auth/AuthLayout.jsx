/* eslint-disable */
import { Outlet } from 'react-router-dom';
import React, { useEffect } from 'react';
import Loading from '../../components/loading/Loading';
import Header from '../../components/header/Header';
import Toasts from '../../components/Notification/Toasts';
import ErrResponse from '../../components/common/form/ErrResponse';

const AuthLayout = () => {
    useEffect(() => {
        // document.body.classList.add("black_bg");
        // return () => document.body.classList.remove("black_bg"); //on unmoount
    }, []);

    return (
        <>
            <Loading />
            <Toasts />
            <div className="wrapper px-2 px-md-0">
                <Header />
                <div className="container mt-4 mb-4 px-lg-5 px-xl-0">
                    <div className="row justify-content-between">
                        {/* Main Content goes here */}
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    );
};

export default AuthLayout;
