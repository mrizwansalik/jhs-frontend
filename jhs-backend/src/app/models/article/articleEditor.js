// third party import
const mongoose = require('mongoose');
const Joi = require("joi");

// access schema from mongoose
const Schema = mongoose.Schema;

// create Object of schema for article Status
const articleEditorSchema = new Schema(
    {
        editor_type: {
            type: String,
            required: true,
        },
        editor_id: {
            type: Schema.Types.ObjectId,
            ref: "user",
        },
        article_id: {
            type: Schema.Types.ObjectId,
            ref: "article",
        },
        is_assigned_by: {
            type: Schema.Types.ObjectId,
            ref: "user",
        },
        assigned_date: {
            type: Date,
        },
        deadline_date: {
            type: Date,
        },
        unassigned_request_date: {
            type: Date,
        },
        unassigned_reason: {
            type: String,
        },
        unassigned_date: {
            type: Date,
        },
        unassigned_approved_by: {
            type: Schema.Types.ObjectId,
            ref: "user",
        },
        unassigned_substitute: {
            type: Schema.Types.ObjectId,
            ref: "user",
        },
        active: {
            type: Boolean,
            default: true,
        },
    }
);

articleEditorSchema.index({editor_id: 1, article_id: 1}, {unique: true},);

// create mongoose model from schema
const ArticleEditor = mongoose.model("articleEditor", articleEditorSchema);

// export model
module.exports = {ArticleEditor};
