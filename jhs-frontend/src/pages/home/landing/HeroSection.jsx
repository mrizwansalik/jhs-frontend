

/* eslint-disable */
import React from 'react';
import SearchBox from './SearchBox';

const HeroSection = () => {

   return (
      <section className="bg-faded-primary d-flex min-vh-100 overflow-hidden py-5">
         <div className="container d-flex justify-content-center pb-sm-3 py-md-4 py-xl-5">
            <div
               className="jarallax position-absolute top-0 start-0 w-100 h-100 mt-5"
               data-jarallax=""
               data-speed="0.6"
            >
               <div
                  id="jarallax-container-0"
                  style={{
                     position: "absolute",
                     top: 0,
                     left: 0,
                     width: "100%",
                     height: "100%",
                     overflow: "hidden",
                     zIndex: -100,
                     clipPath: "polygon(0px 0px, 100% 0px, 100% 100%, 0px 100%)",
                  }}
               >
                  <div
                     className="jarallax-img position-absolute w-100 h-100"
                     style={{
                        backgroundImage:
                           'url("assets/img/landing/web-studio/hero-wave.png")',
                        objectFit: "cover",
                        objectPosition: "50% 50%",
                        maxWidth: "none",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: 1660,
                        height: "578.4px",
                        overflow: "hidden",
                        pointerEvents: "none",
                        transformStyle: "preserve-3d",
                        backfaceVisibility: "hidden",
                        marginTop: "-58.2px",
                        transform: "translate3d(0px, 7px, 0px)",
                     }}
                     data-jarallax-original-styles="background-image: url(assets/img/landing/web-studio/hero-wave.png);"
                  />
               </div>
            </div>
            <div className="row align-items-center pt-5 mt-4 mt-xxl-0">
               {/* Video + Parallax*/}
               <div className="col-lg-6 mb-4 mb-lg-0 pb-3 pb-lg-0">
                  <div
                     className="parallax mx-auto mx-lg-0"
                     style={{
                        maxWidth: 582,
                        transform: "translate3d(0px, 0px, 0px) rotate(0.0001deg)",
                        transformStyle: "preserve-3d",
                        backfaceVisibility: "hidden",
                        pointerEvents: "none",
                     }}
                  >
                     <div
                        className="parallax-layer zindex-3"
                        data-depth="0.1"
                        style={{
                           transform: "translate3d(4.7px, -2.1px, 0px)",
                           transformStyle: "preserve-3d",
                           backfaceVisibility: "hidden",
                           position: "relative",
                           display: "block",
                           left: 0,
                           top: 0,
                        }}
                     >
                        <div
                           className="position-relative mx-auto"
                           style={{
                              maxWidth: "70%",
                              padding: ".3125rem",
                              marginBottom: "9.9%",
                              backgroundColor: "#121519",
                              borderRadius: "calc(var(--ar-border-radius) * 2.125)",
                           }}
                        >
                           <img
                              src="assets/img/book.jpg"
                              style={{
                                 borderRadius: "calc(var(--ar-border-radius) * 2.125)",
                              }}
                              alt="Layer"
                           />
                        </div>
                     </div>
                     <div
                        className="parallax-layer"
                        data-depth="0.3"
                        style={{
                           transform: "translate3d(14.2px, -6.4px, 0px)",
                           transformStyle: "preserve-3d",
                           backfaceVisibility: "hidden",
                           position: "absolute",
                           display: "block",
                           left: 0,
                           top: 0,
                        }}
                     >
                        <img
                           src="assets/img/landing/marketing-agency/hero/shape01.svg"
                           alt="Background shape"
                        />
                     </div>
                     <div
                        className="parallax-layer zindex-2"
                        data-depth="-0.1"
                        style={{
                           transform: "translate3d(-4.7px, 2.1px, 0px)",
                           transformStyle: "preserve-3d",
                           backfaceVisibility: "hidden",
                           position: "absolute",
                           display: "block",
                           left: 0,
                           top: 0,
                        }}
                     >
                        <img
                           src="assets/img/landing/marketing-agency/hero/shape02.svg"
                           alt="Background shape"
                        />
                     </div>
                     <div
                        className="parallax-layer"
                        data-depth="-0.15"
                        style={{
                           transform: "translate3d(-7.1px, 3.2px, 0px)",
                           transformStyle: "preserve-3d",
                           backfaceVisibility: "hidden",
                           position: "absolute",
                           display: "block",
                           left: 0,
                           top: 0,
                        }}
                     >
                        <img
                           src="assets/img/landing/marketing-agency/hero/shape03.svg"
                           alt="Background shape"
                        />
                     </div>
                     <div
                        className="parallax-layer zindex-2"
                        data-depth="-0.25"
                        style={{
                           transform: "translate3d(-11.9px, 5.3px, 0px)",
                           transformStyle: "preserve-3d",
                           backfaceVisibility: "hidden",
                           position: "absolute",
                           display: "block",
                           left: 0,
                           top: 0,
                        }}
                     >
                        <img
                           src="assets/img/landing/marketing-agency/hero/shape04.svg"
                           alt="Background shape"
                        />
                     </div>
                  </div>
               </div>
               <div className="col-lg-6 text-center text-lg-start">
                  <h1 className="display-4 pb-3 mb-4">
                     <span className="fw-bold">
                        Journal Of <span className="text-primary">Healthcare</span>{" "}
                        Sciences
                     </span>
                  </h1>
                  <p className="text-lg-start pb-2 pb-md-0 mb-4 mb-md-5">
                     Journal of HealthCare Sciences (JOHS) is a Saudi peer-reviewed
                     healthcare and science journal for healthcare professionals from
                     all fields of healthcare and science which includes and not
                     limited to medicine, dentistry, nursing, pharmacy and
                     physiotherapy
                  </p>
                  <SearchBox />
               </div>
            </div>
         </div>
      </section>
   );
};

export default HeroSection;
