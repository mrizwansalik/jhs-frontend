// third party import
const mongoose = require('mongoose');
const Joi = require("joi");

// access schema from mongoose
const Schema = mongoose.Schema;

// create Object of schema for article status
const articlePublishedSchema = new Schema(
    {
        articleNumber: {
            type: String,
            unique: true,
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        type: {
            type: String,
            required: true,
        },
        keywords: [{
            type: String,
            index: true // Indexed for faster searches
        }],
        abstract: {
            type: String,
            required: true,
        },
        category: [{
            type: Schema.Types.ObjectId,
            ref: "category",
            index: true // For faster filtering by category
        }],
        articlePublished_data_id: {
            type: Schema.Types.ObjectId,
            ref: "articlePublishedData",
            required: true,
        },
        views: {
            type: Number,
            default: 0,
            index: true // Indexed to optimize for frequent views queries
        },
        downloads: {
            type: Number,
            default: 0,
            index: true // Indexed to optimize for frequent views queries
        },
        articleMatrices_data_id: {
            type: Schema.Types.ObjectId,
            ref: "articlePublishedMetrics",
            required: true,
        },
        journal_info: {
            type: Schema.Types.ObjectId,
            ref: "journal",
        },
        _author: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        authorList: [{
            type: Schema.Types.ObjectId,
            ref: "user",
        }],
        reviewerList: [{
            type: Schema.Types.ObjectId,
            ref: "user",
        }],
        reviewerLog: [{
            type: Schema.Types.ObjectId,
            ref: "reviewLog",
        }],

        managedBy: {
            type: Schema.Types.ObjectId,
            ref: "user",
            default: null,
        },
        editors: [{
            type: Schema.Types.ObjectId,
            ref: "user",
            default: null,
        }],
        doi: {
            type: String,
            required: true,
        },
        pdf: {
            type: String,
            default: "",
            trim: true
        },
        page: {
            type: String,
            required: true,
            default: "0"
        },
        volume: {
            type: String,
            required: true,
        },
        issue: {
            type: String,
            required: true,
        },
        submittedAt: {
            type: Date,
            required: true,
        },
        acceptedAt: {
            type: Date,
            required: true,
        },
        revisedAt: {
            type: Date,
        },
        publishedAt: {
            type: Date,
            required: true,
            default: Date.now, // Automatically set if not provided
            index: true,
        },
        invoice: [{
            type: Schema.Types.ObjectId,
            ref: "invoice",
        }],
        rating: [{
            type: Schema.Types.ObjectId,
            ref: "publicationRating",
        }],
    },
);

// create mongoose model from schema
const ArticlePublished = mongoose.model("articlePublished", articlePublishedSchema);

// validator for adding any article published
const articlePublishedValidate = (articlePublished) => {
    const schema = Joi.object({
        articlePublished_data_id: Joi.string().required().messages({
            'string.empty': `Article published data cannot be an empty`,
            'any.required': `Article published data is a required`
        }),
        isDraft: Joi.boolean(),
        _author: Joi.string().required().messages({
            'string.empty': `Author Information cannot be an empty`,
            'any.required': `Author Information is a required`
        }),
    }).options({ abortEarly: false });
    return schema.validate(articlePublished);
};

// validator for updating and article published
const articlePublishedUpdateValidate = (articlePublished) => {
    const schema = Joi.object({
        title: Joi.string().messages({
            'string.empty': `Title cannot be an empty`,
            'any.required': `Title is a required`
        }),
        type: Joi.string().messages({ 'string.empty': `Type cannot be an empty` }),
        abstract: Joi.string().messages({ 'string.empty': `Abstract cannot be an empty` }),
        keywords: Joi.array().items(Joi.string()).messages({ 'string.empty': `Keywords cannot be an empty` }),
        category: Joi.array().items(Joi.string()).messages({ 'string.empty': `Category cannot be an empty` }),
        journal_info: Joi.string().messages({ 'string.empty': `Journal Information cannot be an empty` }),
        accepted_at: Joi.date().iso().messages({ 'string.empty': `Accepted date cannot be an empty` }),
        revised_at: Joi.date().iso().greater(Joi.ref('accepted_at')).messages({ 'string.empty': `Revised date  cannot be an empty` }),
        received_at: Joi.date().iso().greater(Joi.ref('revised_at')).messages({ 'string.empty': `Received date  at cannot be an empty` }),
        introduction: Joi.string().messages({ 'string.empty': `Introduction cannot be an empty` }),
        methodology: Joi.string().messages({ 'string.empty': `Methodology cannot be an empty` }),
        result: Joi.string().messages({ 'string.empty': `Result cannot be an empty` }),
        case_presentation: Joi.string().messages({ 'string.empty': `Case presentation cannot be an empty` }),
        discussion: Joi.string().messages({ 'string.empty': `Discussion cannot be an empty` }),
        conclusion: Joi.string().messages({ 'string.empty': `Conclusion cannot be an empty` }),
        acknowledgement: Joi.string().messages({ 'string.empty': `Acknowledgement cannot be an empty` }),
        disclosure: Joi.string().messages({ 'string.empty': `Discloser cannot be an empty` }),
        supplementary: Joi.string().messages({ 'string.empty': `Supplementary cannot be an empty` }),
    }).options({ abortEarly: false });
    return schema.validate(articlePublished);
};

// export model
module.exports = { ArticlePublished, articlePublishedValidate, articlePublishedUpdateValidate };
