

/* eslint-disable */
import React, { useEffect, useState } from 'react';
import style from './star-rating-style.module.css';

const RatingStar = ({ onRatingChange }) => {

   const [rating, setRating] = useState(0);

   useEffect(() => {
     // Initialize Bootstrap tooltips after the component renders
     const tooltipElements = document.querySelectorAll('[data-bs-toggle="tooltip"]');
     tooltipElements.forEach((tooltipElement) => {
       new window.bootstrap.Tooltip(tooltipElement);
     });
   }, []);
 
   const handleRating = (index) => {
     setRating(index + 1);
     if (onRatingChange) onRatingChange(index + 1); // Notify parent about the change
   };

   return (
      <section className="p-1 d-flex w-100">
         <ul className="rating list-unstyled d-flex" style={{ gap: "10px" }}>
            {["Bad", "Poor", "OK", "Good", "Excellent"].map((tooltip, index) => (
               <li key={index}>
                  <i
                     className={`ai-star-filled ${index < rating ? "active" : ""}`}
                     data-bs-toggle="tooltip"
                     data-bs-title={tooltip}
                     style={{
                        cursor: "pointer",
                        fontSize: "1.5rem",
                        color: index < rating ? "#ffc107" : "#ccc",
                        transition: "color 0.3s ease",
                     }}
                     onClick={() => handleRating(index)}
                  ></i>
               </li>
            ))}
         </ul>
      </section>
   );
};

export default RatingStar;