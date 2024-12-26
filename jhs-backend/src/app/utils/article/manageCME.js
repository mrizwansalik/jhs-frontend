const { UserReport } = require("../../models/userReport");

exports.logReviewActivity = async (reviewerId, articleId, timeSpent) => {
   
   const cmeHours = calculateCME(timeSpent); // Calculate CME hours based on the time spent

   await UserReport.findByIdAndUpdate(
      {userId, reviewerId},
      {
         $push: {
            reviewLogs: { articleId, timeSpent, date: new Date() },
         },
         $inc: {
            reviewsCompleted: 1,
            cmeHours: cmeHours,
         },
      },
      { new: true }
   );
};

const calculateCME = (timeSpent) => {
   return timeSpent / 60; // 1 CME hour per 60 minutes
};