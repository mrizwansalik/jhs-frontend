// third party import
const mongoose = require('mongoose');

// access schema from mongoose
const Schema = mongoose.Schema;

// create Object of schema for articlePublishedMetrics Status
const articlePublishedMetricsSchema = new Schema(
    {
        viewsInfo: [{
            code: { type: String, required: true, default: "other" },
            country: { type: String, required: true, default: "other" },
            region: { type: String, required: true, default: "other" },
            deviceId: { type: String, required: true, default: "other" },
            date: { type: Date, required: true, default: new Date },
        }],
        downloadsInfo: [{
            code: { type: String, required: true, default: "other" },
            country: { type: String, required: true, default: "other" },
            region: { type: String, required: true, default: "other" },
            deviceId: { type: String, required: true, default: "other" },
            date: { type: Date, required: true, default: new Date },
        }],
    },
    {
        timestamps: true,
    }
);

// create mongoose model from schema
const ArticlePublishedMetrics = mongoose.model("articlePublishedMetrics", articlePublishedMetricsSchema);

// export model
module.exports = { ArticlePublishedMetrics };
