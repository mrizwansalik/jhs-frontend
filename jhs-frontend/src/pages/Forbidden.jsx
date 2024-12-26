/* eslint-disable */
import React from 'react';
import { Link } from 'react-router-dom';

const Forbidden = () => {
  return (
    <>
      <main className="page-wrapper">
        {/* Page content*/}
        <div className="container d-flex flex-column justify-content-center min-vh-100 py-5">
          <lottie-player className="d-dark-mode-none mt-n5" src="assets/json/animation-404-light.json" background="transparent" speed={1} loop autoPlay />
          <lottie-player className="d-none d-dark-mode-block mt-n5" src="assets/json/animation-404-dark.json" background="transparent" speed={1} loop autoPlay />
          <div className="text-center pt-4 mt-lg-2">
            <h1 className="display-5">Access Denied</h1>
            <p className="fs-lg pb-2 pb-md-0 mb-4 mb-md-5">You Don’t Have Permission To Access on This Server.</p> <Link className="btn btn-lg btn-primary" to='/'>Go to homepage</Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default Forbidden;