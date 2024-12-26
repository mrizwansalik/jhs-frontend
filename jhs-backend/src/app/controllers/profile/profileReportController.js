// third party import
const jwt = require('jsonwebtoken');

// import config information
const clientSecret = require("../../config/clientSecret.config");

// import models
const { UserReport } = require('../../models/userReport');

// import utils (helper functions)
const catchAsync = require('../../utils/catchAsync');
const { Response } = require('../../../framework');

// update Login profile information 
exports.getProfileReport = catchAsync(async (req, res) => {

   const token = req.get('Authorization').split(' ')[1];
   let decodedToken = jwt.verify(token, clientSecret.key);
   const userId = decodedToken.userId;

   // Find the user report by userId
   const userReport = await UserReport.findOne({ user_id: userId })
      .populate('articles.published_list')
      .populate('articles.pending_list')
      .populate('articles.reviewed_list');

   if (!userReport) {
      // return with error of user report not found in db.
      return res.status(404).json(
         Response.notFound({ message: 'User with this id could not be found.' })
      );
   } // end if

   // send success response
   res.status(200).json(
      Response.success({
         message: 'Profile Report information found!',
         status: 200,
         data: userReport,
         accessToken: req.token,
      })
   );
});