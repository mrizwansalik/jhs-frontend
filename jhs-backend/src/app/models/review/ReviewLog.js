// third party import
const mongoose = require('mongoose');

// access schema from mongoose
const Schema = mongoose.Schema;

const ReviewLogSchema = new Schema(
   {
      reviewerId: mongoose.Schema.Types.ObjectId,
      comment: { type: String },
      timeSpent: { type: Number },
      status: {
         type: String,
         enum: ['pending', 'approved', 'certified'],
         default: 'pending'
      },
      date: { type: Date, default: Date.now },
   },
   { timestamps: true }
);

const ReviewLog = mongoose.model("reviewLog", ReviewLogSchema);

module.exports = { ReviewLog };