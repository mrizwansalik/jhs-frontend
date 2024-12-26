// third party import
const mongoose = require('mongoose');
const Joi = require("joi");

// access schema from mongoose
const Schema = mongoose.Schema;

// create Object of schema for articlePublishedData Status
const articlePublishedDataSchema = new Schema(
    {
        introduction: {
            type: String,
        },
        methodology: {
            type: String,
        },
        result: {
            type: String,
        },
        case_presentation: {
            type: String,
        },
        discussion: {
            type: String,
        },
        conclusion: {
            type: String,
        },
        acknowledgement: {
            type: String,
        },
        disclosure: {
            type: String,
        },
        supplementary: {
            type: String,
        },
        table_list: [{
            title: { type: String, required: true },
            label: { type: String },
            data: { type: String, required: true },
            tableAssociated: { type: String, required: true, default: 'methodology' },
        }],
        figures_list: [{
            title: { type: String, required: true },
            label: { type: String },
            thumbnail_url: { type: String, required: true },
            medium_url: { type: String, required: true },
            picture_url: { type: String, required: true },
            xl_picture_url: { type: String, required: true },
            figureAssociated: { type: String, required: true, default: 'methodology' },
        }],
        videos_list: [{
            title: { type: String, required: true },
            label: { type: String },
            url: { type: String, required: true },
            videoAssociated: { type: String, required: true, default: 'methodology' },
        }],
        reference: [{
            authors: { type: String, required: false },
            type: { type: String, required: true, enum: ['book', "journal", 'website'], default: 'website' },
            title: { type: String, required: false },
            journal: { type: String },
            year: { type: String },
            volume: { type: String },
            issue: { type: String },
            pages: { type: String },
            doi: { type: String },
            url: { type: String },
            editor: { type: String },
            publisher: { type: String },
            publishLocation: { type: String },
            publicationData: { type: String },
            accessDate: { type: String },
            original_text: { type: String },
            verified: { type: Boolean, required: false, default: false },
        }],
    },
    {
        timestamps: true,
    }
);

// create mongoose model from schema
const ArticlePublishedData = mongoose.model("articlePublishedData", articlePublishedDataSchema);

// validator for adding any article data
const articlePublishedDataValidate = (articlePublishedData) => {
    const schema = Joi.object({
        introduction: Joi.string().required().messages({ 'string.empty': `Introduction cannot be an empty` }),
        methodology: Joi.string().messages({ 'string.empty': `Methodology cannot be an empty` }),
        result: Joi.string().required().messages({ 'string.empty': `Result cannot be an empty` }),
        case_presentation: Joi.string().messages({ 'string.empty': `Case presentation cannot be an empty` }),
        discussion: Joi.string().messages({ 'string.empty': `Discussion cannot be an empty` }),
        conclusion: Joi.string().messages({ 'string.empty': `Conclusion cannot be an empty` }),
        acknowledgement: Joi.string().messages({ 'string.empty': `Acknowledgement cannot be an empty` }),
        disclosure: Joi.string().messages({ 'string.empty': `Discloser cannot be an empty` }),
        supplementary: Joi.string().messages({ 'string.empty': `Supplementary cannot be an empty` }),
    }).options({ abortEarly: false });
    return schema.validate(articlePublishedData);
};

// validator for updating and article data
const articlePublishedDataUpdateValidate = (articlePublishedData) => {
    const schema = Joi.object({
        introduction: Joi.string().required().messages({ 'string.empty': `Introduction cannot be an empty` }),
        methodology: Joi.string().messages({ 'string.empty': `Methodology cannot be an empty` }),
        result: Joi.string().required().messages({ 'string.empty': `Result cannot be an empty` }),
        case_presentation: Joi.string().messages({ 'string.empty': `Case presentation cannot be an empty` }),
        discussion: Joi.string().messages({ 'string.empty': `Discussion cannot be an empty` }),
        conclusion: Joi.string().messages({ 'string.empty': `Conclusion cannot be an empty` }),
        acknowledgement: Joi.string().messages({ 'string.empty': `Acknowledgement cannot be an empty` }),
        disclosure: Joi.string().messages({ 'string.empty': `Discloser cannot be an empty` }),
        supplementary: Joi.string().messages({ 'string.empty': `Supplementary cannot be an empty` }),
    }).options({ abortEarly: false });
    return schema.validate(articlePublishedData);
};

// validator for updating and article data
const articleReferenceDataValidate = (articlePublishedData) => {
    var schema;
    switch (articlePublishedData.type) {
        case 'book':
            schema = Joi.object({
                authors: Joi.string().messages({ 'string.empty': `Please provide a valid Author information` }),
                type: Joi.string().messages({ 'string.empty': `Please provide a valid type` }),
                title: Joi.string().messages({ 'string.empty': `Please provide a valid title`, 'any.required': `Reference title is a required` }),
                editor: Joi.string().messages({ 'string.empty': `Please provide a valid Source name` }),
                publisher: Joi.string().messages({ 'string.empty': `Please provide a valid Source name` }),
                publishLocation: Joi.string().messages({ 'string.empty': `Please provide a valid Source name` }),
                year: Joi.string().messages({ 'string.empty': `Please provide a valid year` }),
            }).keys({
                doi: Joi.string().messages({ 'string.empty': `Please provide a valid DOI` }),
                url: Joi.string().messages({ 'string.empty': `Please provide a valid URL` }),
            }).or('doi', 'url').options({ abortEarly: false });
            break;
        case "journal":
            schema = Joi.object({
                authors: Joi.string().messages({ 'string.empty': `Please provide a valid Author information` }),
                type: Joi.string().messages({ 'string.empty': `Please provide a valid type` }),
                title: Joi.string().required().messages({ 'string.empty': `Please provide a valid title`, 'any.required': `Reference title is a required` }),
                journal: Joi.string().messages({ 'string.empty': `Please provide a valid Journal` }),
                year: Joi.string().messages({ 'string.empty': `Please provide a valid year` }),
                pages: Joi.string().messages({ 'string.empty': `Please provide a valid pages` }),
                volume: Joi.string().messages({ 'string.empty': `Please provide a valid volume` }),
                issue: Joi.string().messages({ 'string.empty': `Please provide a valid issue` }),
            }).keys({
                doi: Joi.string().messages({ 'string.empty': `Please provide a valid DOI` }),
                url: Joi.string().messages({ 'string.empty': `Please provide a valid URL` }),
            }).or('doi', 'url').options({ abortEarly: false });
            break;
        case 'website':
            schema = Joi.object({
                title: Joi.string().required().messages({ 'string.empty': `Introduction cannot be an empty`, 'any.required': `Reference title is a required` }),
                type: Joi.string().messages({ 'string.empty': `Methodology cannot be an empty` }),
                year: Joi.string().messages({ 'string.empty': `Result cannot be an empty` }),
                accessData: Joi.string().messages({ 'string.empty': `Case presentation cannot be an empty` }),
                url: Joi.string().required().messages({ 'string.empty': `Discussion cannot be an empty`, 'any.required': `Please provide a valid URL` }),
            }).options({ abortEarly: false });
            break;
        default:
            schema = Joi.object({
                authors: Joi.string().messages({ 'string.empty': `Please provide a valid Author information` }),
                type: Joi.string().messages({ 'string.empty': `Please provide a valid type` }),
                title: Joi.string().messages({ 'string.empty': `Please provide a valid title`, 'any.required': `Reference title is a required` }),
                editor: Joi.string().messages({ 'string.empty': `Please provide a valid Source name` }),
                publisher: Joi.string().messages({ 'string.empty': `Please provide a valid Source name` }),
                publishLocation: Joi.string().messages({ 'string.empty': `Please provide a valid Source name` }),
                year: Joi.string().messages({ 'string.empty': `Please provide a valid year` }),
            }).keys({
                doi: Joi.string().messages({ 'string.empty': `Please provide a valid DOI` }),
                url: Joi.string().messages({ 'string.empty': `Please provide a valid URL` }),
            }).or('doi', 'url').options({ abortEarly: false });
            break;
    }
    return schema.validate(articlePublishedData);
};


// export model
module.exports = { ArticlePublishedData, articlePublishedDataValidate, articlePublishedDataUpdateValidate, articleReferenceDataValidate };
