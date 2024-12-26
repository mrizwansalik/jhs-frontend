/* eslint-disable */
import { Outlet } from 'react-router-dom';
import React, { useEffect } from 'react';
import Header from '../../components/header/Header';
import Loading from '../../components/loading/Loading';
import Toasts from '../../components/Notification/Toasts';
import Footer from '../../components/footer/Footer';
import { useSelector } from 'react-redux';
import BackToTop from 'components/BackToTop/BackToTop';

const ClientUserLayout = () => {

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `${window.location.origin}/assets/js/theme.min.js`;
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        }
    }, []);

    const user = useSelector((state) => state.profile.profile);
    if (!user) {
        // return null;
    }
    return (
        <div >
            <Loading />
            <main className="page-wrapper" style={{ minHeight: '100vh' }}>
                {/* Navbar. Remove 'fixed-top' class to make the navigation bar scrollable with the page*/}
                <Header />
                {/* Page content*/}
                <div className="container pt-5 pb-lg-5 pb-md-4 pb-2 my-5">
                    {/* Main Content goes here */}
                    <Outlet />
                </div>
            </main>
            <BackToTop />
            <Toasts />
            <Footer />
        </div>
    );
};

export default ClientUserLayout;
