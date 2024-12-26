/* eslint-disable */
import React, { useEffect } from "react";

import HomePageArticle from "./article/HomePageArticle";
import AuthorList from "./landing/AuthorList";
import Resources from "./landing/Resources";
import Subscribe from "./landing/Subscribe";
import Statistics from "./landing/Statistics";
import HeroSection from "./landing/HeroSection";

const HomePage = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `${window.location.origin}/assets/js/theme.min.js`;
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <HeroSection />
      <Statistics />
      <HomePageArticle />
      <Subscribe />
      <AuthorList />
      <Resources />
    </>
  );
};

export default HomePage;
