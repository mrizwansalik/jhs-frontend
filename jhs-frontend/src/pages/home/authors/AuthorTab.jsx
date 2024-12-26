/* eslint-disable  */
import React from 'react';
import { Link, useParams } from 'react-router-dom';

const AuthorTab = () => {

   let { authorId } = useParams();

   return (
      <div className="border-bottom">
         <div className="d-flex align-items-center">
            {/* Nav tabs */}
            <ul
               className="nav nav-tabs card-header-tabs align-items-center mb-n1"
               role="tablist"
            >
               <li className="nav-item me-3" role="authorPublications">
                  <Link
                     className={`nav-link px-0 py-2 border-0 rounded-1 ${location.pathname === `/published/author/${authorId}/view` ? 'active' : ''} `}
                     to={""}
                  >
                     <i className="ai-award fs-lg opacity-90 me-2" />
                     Publications
                  </Link>
               </li>
               <li className="vr opacity-20 my-3 me-3" />
               <li className="nav-item me-3" role="authorCollaborations">
                  <Link
                     className={`nav-link px-0 py-2 border-0 rounded-1 ${location.pathname === `/published/author/${authorId}/view/collaborations` ? 'active' : ''} `}
                     to={"collaborations"}
                  >
                     <i className="ai-award fs-xl opacity-90 me-2" />
                     Collaborations
                  </Link>
               </li>
               <li className="vr opacity-20 my-3 me-3" />
               <li className="nav-item me-3" role="authorReviews">
                  <Link
                     className={`nav-link px-0 py-2 border-0 rounded-1 ${location.pathname === `/published/author/${authorId}/view/reviews` ? 'active' : ''} `}
                     to={"reviews"}
                  >
                     <i className="ai-checks opacity-90 me-2" />
                     Reviews
                  </Link>
               </li>
               <li className="vr opacity-20 my-3 me-3" />
               <li className="nav-item me-3" role="authorRating">
                  <Link
                     className={`nav-link px-0 py-2 border-0 rounded-1 ${location.pathname === `/published/author/${authorId}/view/rating` ? 'active' : ''} `}
                     to={"rating"}
                  >
                     <i className="ai-star opacity-90 me-2" />
                     Rating
                  </Link>
               </li>
               <li className="vr opacity-20 my-3 me-3" />
               <li className="nav-item me-3" role="authorStats">
                  <Link
                     className={`nav-link px-0 py-2 border-0 rounded-1 ${location.pathname === `/published/author/${authorId}/view/stats` ? 'active' : ''} `}
                     to={"stats"}
                  >
                     <i className="ai-chart opacity-90 me-2" />
                     Stats
                  </Link>
               </li>
            </ul>
         </div>
      </div>
   );
};

export default AuthorTab;