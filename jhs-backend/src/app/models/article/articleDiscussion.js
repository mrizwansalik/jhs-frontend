// third party import
const mongoose = require('mongoose');
const Joi = require("joi");

// access schema from mongoose
const Schema = mongoose.Schema;

// create Object of schema for article comment 
const articleDiscussionSchema = new Schema(
    {
        editor: [{
            type: Schema.Types.ObjectId,
            ref: "message",
            required: false,
        }],
        authors: [{
            type: Schema.Types.ObjectId,
            ref: "message",
            required: false,
        }],
        reviewers: [{
            type: Schema.Types.ObjectId,
            ref: "message",
            required: false,
        }],
        reviewers_editor: [{
            type: Schema.Types.ObjectId,
            ref: "message",
            required: false,
        }],
        authors_editor: [{
            type: Schema.Types.ObjectId,
            ref: "message",
            required: false,
        }],
    },
    {
        timestamps: true,
    }
);


// create mongoose model from schema
const ArticleDiscussion = mongoose.model("articleDiscussion", articleDiscussionSchema);


// export model
module.exports = { ArticleDiscussion };
