

/* eslint-disable */
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const TrendingTopics = () => {

   const trendingKeywords = useSelector((state) => state.home.trendingKeywords);

   return (
      <div className='d-flex'>
         <div className="align-items-center px-4 pb-4">
            {/* Visible on screens > 991px */}
            <div className="d-none d-lg-flex flex-wrap align-items-center">
               <h3 className="h4 mb-2 me-4">Trending Topics:</h3>
               {
                  trendingKeywords.map((keyword) => (
                     <Link key={`keyword_${keyword._id}`}
                        className="badge border-primary text-primary bg-secondary fs-lg border shadow mx-2 mb-2"
                        to={`/articles?article_keyword=${encodeURIComponent(keyword._id)}`}
                     >
                        {keyword?._id}
                     </Link>
                  ))
               }
            </div>
         </div>
      </div>
   );
};

export default TrendingTopics;