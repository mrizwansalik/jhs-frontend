var moment = require('moment');

// import utils (helper functions)
const catchAsync = require('../utils/catchAsync');
const { Response } = require('../../framework');
const { User } = require('../../models/user');


// get all article Status
exports.getCurrentIssuesArticles = catchAsync(async (req, res) => {
   try {
      const topUsers = await User.aggregate([
         {
            // Join with user collection to include user information
            $lookup: {
               from: "users", // collection name for users
               localField: "_id", // assuming _id in articleEditorSchema links to the user
               foreignField: "_id", // assuming _id in userSchema is used
               as: "user_info",
            },
         },
         { $unwind: "$user_info" }, // Flatten user_info array
         {
            // Calculate a score (you can adjust weight as needed)
            $addFields: {
               score: {
                  $add: [
                     "$author_rating",
                     "$reviewer_rating",
                     "$article_published",
                     "$article_reviewed",
                  ],
               },
            },
         },
         {
            // Sort by the computed score in descending order
            $sort: { score: -1 },
         },
         {
            // Limit to the top 8 users
            $limit: 8,
         },
         {
            // Select fields you want in the output
            $project: {
               "user_info.username": 1,
               "user_info.full_name": 1,
               "author_rating": 1,
               "reviewer_rating": 1,
               "article_published": 1,
               "article_reviewed": 1,
               score: 1,
            },
         },
      ]);

      res.status(200).json(
         Response.success({
            message: 'Success',
            status: 200,
            data: topUsers,
            accessToken: req.token,
         })
      );
   } catch (err) {
      console.error("Error fetching top users:", err);
      res.status(200).json(
         Response.error({
            message: 'Error fetching top users',
            status: 500,
            data: err.message,
            accessToken: req.token,
         })
      );
   }
});

