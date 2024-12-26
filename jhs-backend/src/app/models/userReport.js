// Third-party imports
const mongoose = require('mongoose');

// Access schema from mongoose
const Schema = mongoose.Schema;

// Define schema for user report on article statistics
const userReportSchema = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "user", // Changed to reference the User model directly for user-specific reports
            required: true
        },
        cme: {
            cmeHours: { type: Number, default: 0 }, // Total CME hours
            reviewLogs: [{ type: Schema.Types.ObjectId, ref: "reviewLog" }],
        },
        articles: {
            pending_count: { type: Number, default: 0 }, 
            rejected_count: { type: Number, default: 0 },
            revision_count: { type: Number, default: 0 },

            pending_reviewed_count: { type: Number, default: 0 },
            rejected_reviewed_count: { type: Number, default: 0 },
            reviewed_count: { type: Number, default: 0 },
            completed_reviewed_count: { type: Number, default: 0 },

            published_count: { type: Number, default: 0 },
            collaboration_count: { type: Number, default: 0 },

            pending_list: [{ type: Schema.Types.ObjectId, ref: "article" }],
            rejected_list: [{ type: Schema.Types.ObjectId, ref: "article" }],
            revision_list: [{ type: Schema.Types.ObjectId, ref: "article" }],

            pending_reviewed_list: [{ type: Schema.Types.ObjectId, ref: "article" }],
            rejected_reviewed_list: [{ type: Schema.Types.ObjectId, ref: "article" }],
            reviewed_list: [{ type: Schema.Types.ObjectId, ref: "article" }],
            completed_reviewed_list: [{ type: Schema.Types.ObjectId, ref: "articlePublished" }],

            published_list: [{ type: Schema.Types.ObjectId, ref: "articlePublished" }],
            collaboration_list: [{ type: Schema.Types.ObjectId, ref: "articlePublished" }],
        },
        ratings: {
            average_rating: { type: Number, default: 0 },
            
            average_publication_rating: { type: Number, min: 0, max: 5, default: 0 },
            average_reviewer_rating: { type: Number, min: 0, max: 5, default: 0 },
            average_editor_rating: { type: Number, min: 0, max: 5, default: 0 },
            
            publication_rating_list: [{ type: Schema.Types.ObjectId, ref: "publicationRating" }],
            review_rating_list: [{ type: Schema.Types.ObjectId, ref: "reviewRating" }],
            editor_rating_list: [{ type: Schema.Types.ObjectId, ref: "editorRating" }],
        }, 
        total_citations: { type: Number, default: 0 },
    },
    { timestamps: true } // Adds createdAt and updatedAt fields
);

// Create unique index on user_id for one report per user
userReportSchema.index({ user_id: 1 }, { unique: true });

// Create mongoose model from schema
const UserReport = mongoose.model("userReport", userReportSchema);

// Export model
module.exports = { UserReport };
