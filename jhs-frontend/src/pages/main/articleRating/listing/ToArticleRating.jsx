/* eslint-disable */
import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { useDispatch } from "react-redux";

import RatingStar from "components/RatingStar/RatingStar";
import { useForm } from "react-hook-form";
import { addArticleRating } from "store/main/publishedArticles/actions";


const ToArticleRating = ({ articleId }) => {

   const dispatch = useDispatch();

   const [rating, setRating] = useState(0);


   const {
      register,
      formState: { errors },
      handleSubmit,
   } = useForm({ reValidateMode: 'onChange' });

   useEffect(() => {
      const script = document.createElement('script');
      script.src = `${window.location.origin}/assets/js/theme.min.js`;
      script.async = true;
      document.body.appendChild(script);
      return () => {
         document.body.removeChild(script);
      }
   }, []);

   useEffect(() => {
      window.scrollTo(0, 0);
   }, []);

   const submitRating = (formData) => {

      console.log("Score:", rating);
      console.log("Comment:", formData.message);
      console.log("Article Id:", articleId);

      if (rating === 0) {
         alert("Please select a rating!");
         return;
      }
      
      dispatch(
         addArticleRating({
             body: { rating: rating, comment: formData.message, articleId: articleId   },
             options: { id: articleId, btnLoader: true, __module: 'articlePublished', showToast: true },
         }));
   }

   return (
      <>
         <form onSubmit={handleSubmit(submitRating)}>
            <div className="mb-1">
               <label htmlFor="rating" className="form-label">
                  Rating:
               </label>
               <RatingStar onRatingChange={setRating} /> {/* Pass callback */}
            </div>

            <div className="mb-2">
               <label htmlFor="message" className="form-label">
                  Feedback:
               </label>
               <textarea
                  id="message"
                  className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                  rows="4"
                  {...register('message', {
                     required: 'Message is required',
                  })}
                  placeholder="Write your message here..."
               />
            </div>
            <button type="submit" className="btn btn-primary">
               Submit Rating
            </button>
         </form>
      </>
   );
};

export default ToArticleRating;

