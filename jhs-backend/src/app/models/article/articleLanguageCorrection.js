// third party import
const mongoose = require('mongoose');
const Joi = require("joi");

// access schema from mongoose
const Schema = mongoose.Schema;

// create Object of schema for articleLanguageCorrection Status
const articleLanguageCorrectionSchema = new Schema(
    {
        title: {
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
        articleLanguageCorrection_data_id: {
            type: Schema.Types.ObjectId,
            ref: "articleLanguageCorrectionData",
            required: true,
        },
        assigned_by: {
            type: Schema.Types.ObjectId,
            ref: "user",
        },
        isVerified: {
            type: Boolean,
            default: false,
            required: true,
        },
        // -1 pending, 0 fail, 1 pass
        status: {
            type: Number,
            default: -1,
            required: true,
        },
        assigned_at: {
            type: Date,
        },
        submitted_at: {
            type: Date,
        },
        accepted_at: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// define schema pre set rule for save operation
articleLanguageCorrectionSchema.pre('save', function (next) {
    let article = this;
    article.slug = article._id.toString();
    next();
});

// define schema pre set rule for update operation
articleLanguageCorrectionSchema.pre('findOneAndUpdate', async function (next) {
    let article = this._update;
    if (typeof (article.slug) != 'undefined') {
        this._update.slug = article.slug.replace(/ /g, "-").toLowerCase();
    }
    next();
});

// create mongoose model from schema
const ArticleLanguageCorrection = mongoose.model("articleLanguageCorrection", articleLanguageCorrectionSchema);

// validator for adding any article languageCorrection
const articleLanguageCorrectionValidate = (article) => {
    const schema = Joi.object({
        articleLanguageCorrection_data_id: Joi.string().required().messages({
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
const articleLanguageCorrectionUpdateValidate = (article) => {
    const schema = Joi.object({
        title: Joi.string().messages({
            'string.empty': `Title cannot be an empty`,
            'any.required': `Title is a required`
        }),
        type: Joi.string().messages({ 'string.empty': `Type cannot be an empty` }),
        abstract: Joi.string().messages({ 'string.empty': `Abstract cannot be an empty` }),
        keywords: Joi.array().items(Joi.string()).messages({ 'string.empty': `Keywords cannot be an empty` }),
        category: Joi.array().items(Joi.string()).messages({ 'string.empty': `Category cannot be an empty` }),

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
module.exports = { ArticleLanguageCorrection, articleLanguageCorrectionValidate, articleLanguageCorrectionUpdateValidate };
