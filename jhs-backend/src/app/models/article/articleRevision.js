// third party import
const mongoose = require('mongoose');
const Joi = require("joi");

// access schema from mongoose
const Schema = mongoose.Schema;

// create Object of schema for articleRevision Status
const articleRevisionSchema = new Schema(
    {
        articleRevisionNumber: {
            type: String,
        },
        journal_info: {
            type: Schema.Types.ObjectId,
            ref: "journal",
        },
        articleMetaInfo: {
            type: Schema.Types.ObjectId,
            ref: "articleMeta",
        },
        title: {
            type: String,
        },
        slug: {
            type: String,
        },
        type: {
            type: String,
        },
        keywords: [{
            type: String,
        }],
        abstract: {
            type: String,
        },
        category: [{
            type: Schema.Types.ObjectId,
            ref: "category",
        }],
        articleRevision_data_id: {
            type: Schema.Types.ObjectId,
            ref: "articleRevisionData",
            required: true,
        },
        suggestedReviewerList: [{
            type: Schema.Types.ObjectId,
            ref: "user",
        }],
        approved_by: {
            type: Schema.Types.ObjectId,
            ref: "user",
        },
        
        submittedAt: {
            type: Date,
        },
        acceptedAt: {
            type: Date,
        },
        isVerified: {
            type: Boolean,
            default: false,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// define schema pre set rule for save operation
articleRevisionSchema.pre('save', function (next) {
    let article = this;
    article.slug = article._id.toString();
    next();
});

// define schema pre set rule for update operation
articleRevisionSchema.pre('findOneAndUpdate', async function (next) {
    let article = this._update;
    if (typeof (article.slug) != 'undefined') {
        this._update.slug = article.slug.replace(/ /g, "-").toLowerCase();
    }
    next();
});

// create mongoose model from schema
const ArticleRevision = mongoose.model("articleRevision", articleRevisionSchema);

// validator for adding any article revision
const articleRevisionValidate = (article) => {
    const schema = Joi.object({
        articleRevision_data_id: Joi.string().required().messages({
            'string.empty': `Article data cannot be an empty`,
            'any.required': `Article data is a required`
        }),
        type: Joi.string().required().messages({
            'string.empty': `Author Type cannot be an empty`,
            'any.required': `Author Type is a required`
        }),
    }).options({ abortEarly: false });
    return schema.validate(article);
};


// validator for updating and article
const articleRevisionUpdateValidate = (article) => {
    const schema = Joi.object({
        articleRevisionNumber: Joi.string().messages({ 'string.empty': `Journal Information cannot be an empty` }),
        journal_info: Joi.string().messages({ 'string.empty': `Journal Information cannot be an empty` }),
        articleMetaInfo: Joi.string().messages({ 'string.empty': `Journal Information cannot be an empty` }),
        title: Joi.string().messages({
            'string.empty': `Title cannot be an empty`,
            'any.required': `Title is a required`
        }),
        slug: Joi.string().messages({ 'string.empty': `Slug cannot be an empty`, 'any.required': `Slug is a required` }),
        type: Joi.string().messages({ 'string.empty': `Type cannot be an empty` }),
        abstract: Joi.string().messages({ 'string.empty': `Abstract cannot be an empty` }),
        keywords: Joi.array().items(Joi.string()).messages({ 'string.empty': `Keywords cannot be an empty` }),
        authorList: Joi.array(),
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
    return schema.validate(article);
};

// export model
module.exports = { ArticleRevision, articleRevisionValidate, articleRevisionUpdateValidate };
