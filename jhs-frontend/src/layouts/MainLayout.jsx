/* eslint-disable */
import { Outlet } from 'react-router-dom';
import React, { useEffect } from 'react';
import Loading from '../components/loading/Loading';
import Toasts from '../components/Notification/Toasts';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import BackToTop from 'components/BackToTop/BackToTop';
import { useDispatch } from 'react-redux';
import { setCoordinates } from "store/coordinates/actions";

const MainLayout = () => { 
    const dispatch = useDispatch();

    // get the current users location
    navigator.geolocation.getCurrentPosition(
        (position) => {
            // save the geolocation coordinates in two variables
            const { latitude, longitude } = position.coords;
            dispatch(setCoordinates({ latitude, longitude }));
        },
        (error) => {
            console.error('Error getting user location:', error);
        },
    );

    useEffect(() => {
        const script = document.createElement('script');
        script.src = `${window.location.origin}/assets/js/theme.min.js`;
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        }
    }, []);


    return (
        <>
            <Loading />
            <Header />
            <main className="page-wrapper">
                <div className="">
                    {/* <Sidebar /> */}
                    {/* Main Content goes here */}
                    <Outlet />
                </div>
            </main>
            <BackToTop />
            <Toasts />
            <Footer />
        </>
    );
};

export default MainLayout;
