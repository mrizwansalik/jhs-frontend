// third party import
const mongoose = require('mongoose');
const Joi = require("joi");

// access schema from mongoose
const Schema = mongoose.Schema;

// create Object of schema for articleHistory Status
const articleHistorySchema = new Schema(
    {
        change_status_history_list: [{
            title: { type: String, required: true },
            status: { type: String, required: true },
            changedBy: {
                type: Schema.Types.ObjectId,
                ref: "user",
                default: null,
            },
            date: { type: Date, required: true },
        }],
        change_editor_history_list: [{
            title: { type: String, required: true },
            editor: {
                type: Schema.Types.ObjectId,
                ref: "user",
                default: null,
            },
            changedBy: {
                type: Schema.Types.ObjectId,
                ref: "user",
                default: null,
            },
            date: { type: Date, required: true },
        }],
        change_edit_history_list: [{
            title: { type: String, required: true },
            changedBy: {
                type: Schema.Types.ObjectId,
                ref: "user",
                default: null,
            },
            date: { type: Date, required: true },
        }],
    },
    {
        timestamps: true,
    }
);

// create mongoose model from schema
const ArticleHistory = mongoose.model("articleHistory", articleHistorySchema);

// export model
module.exports = { ArticleHistory };
