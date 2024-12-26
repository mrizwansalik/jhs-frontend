// third party import
const mongoose = require('mongoose');
const Joi = require("joi");

// access schema from mongoose
const Schema = mongoose.Schema;

// create Object of schema for article Revision Data Status
const articleRevisionDataSchema = new Schema(
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
const ArticleRevisionData = mongoose.model("articleRevisionData", articleRevisionDataSchema);

// validator for adding any article revision data
const articleRevisionDataValidate = (articleRevisionData) => {
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
    return schema.validate(articleRevisionData);
};

// validator for updating and article Revision data
const articleRevisionDataUpdateValidate = (articleRevisionData) => {
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
    return schema.validate(articleRevisionData);
};

// validator for updating and article revision data
const articleRevisionReferenceDataValidate = (articleRevisionData) => {
    var schema;
    switch (articleRevisionData.type) {
        case 'book':
            schema = Joi.object({
                authors: Joi.string().messages({ 'string.empty': `Please provide a valid Author information` }),
                type: Joi.string().messages({ 'string.empty': `Please provide a valid type` }),
                title: Joi.string().messages({ 'string.empty': `Please provide a valid title`, 'any.required': `Reference title is a required` }),
                editor: Joi.string().messages({ 'string.empty': `Please provide a valid Source name` }),
                publisher: Joi.string().messages({ 'string.empty': `Please provide a valid Source name` }),
                publishLocation: Joi.string().messages({ 'string.empty': `Please provide a valid Source name` }),
                year: Joi.string().messages({ 'string.empty': `Please provide a valid year` }),
                original_text: Joi.optional(),
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
                original_text: Joi.optional(),
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
                accessDate: Joi.string().messages({ 'string.empty': `Access date cannot be an empty` }),
                url: Joi.string().required().messages({ 'string.empty': `Discussion cannot be an empty`, 'any.required': `Please provide a valid URL` }),
                original_text: Joi.optional(),
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
                original_text: Joi.optional(),
            }).keys({
                doi: Joi.string().messages({ 'string.empty': `Please provide a valid DOI` }),
                url: Joi.string().messages({ 'string.empty': `Please provide a valid URL` }),
            }).or('doi', 'url').options({ abortEarly: false });
            break;
    }
    return schema.validate(articleRevisionData);
};

// validator for updating and article Revision data
const articleRevisionValidateAlreadyExist = (articleRevisionData) => {
    var schema;
    var data = null;
    switch (articleRevisionData.type) {
        case 'book':
            schema = Joi.object({
                authors: Joi.string().messages({ 'string.empty': `Please provide a valid Author information` }),
                type: Joi.string().messages({ 'string.empty': `Please provide a valid type` }),
                title: Joi.string().messages({ 'string.empty': `Please provide a valid title`, 'any.required': `Reference title is a required` }),
                editor: Joi.string().messages({ 'string.empty': `Please provide a valid Source name` }),
                publisher: Joi.string().messages({ 'string.empty': `Please provide a valid Source name` }),
                publishLocation: Joi.string().messages({ 'string.empty': `Please provide a valid Source name` }),
                year: Joi.string().messages({ 'string.empty': `Please provide a valid year` }),
                original_text: Joi.optional(),
            }).keys({
                doi: Joi.string().messages({ 'string.empty': `Please provide a valid DOI` }),
                url: Joi.string().messages({ 'string.empty': `Please provide a valid URL` }),
            }).or('doi', 'url').options({ abortEarly: false });

            data = {
                authors: articleRevisionData?.authors,
                type: articleRevisionData?.type,
                title: articleRevisionData?.title,
                editor: articleRevisionData?.editor,
                publisher: articleRevisionData?.publisher,
                publishLocation: articleRevisionData?.publishLocation,
                year: articleRevisionData?.year,
                original_text: articleRevisionData?.original_text,
                doi: articleRevisionData?.doi,
                url: articleRevisionData?.url,
            }

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
                original_text: Joi.optional(),
            }).keys({
                doi: Joi.string().messages({ 'string.empty': `Please provide a valid DOI` }),
                url: Joi.string().messages({ 'string.empty': `Please provide a valid URL` }),
            }).or('doi', 'url').options({ abortEarly: false });

            data = {
                authors: articleRevisionData?.authors,
                type: articleRevisionData?.type,
                title: articleRevisionData?.title,
                journal: articleRevisionData?.journal,
                year: articleRevisionData?.year,
                pages: articleRevisionData?.pages,
                volume: articleRevisionData?.volume,
                issue: articleRevisionData?.issue,
                original_text: articleRevisionData?.original_text,
                doi: articleRevisionData?.doi,
                url: articleRevisionData?.url,
            }
            break;
        case 'website':
            schema = Joi.object({
                title: Joi.string().required().messages({ 'string.empty': `Introduction cannot be an empty`, 'any.required': `Reference title is a required` }),
                type: Joi.string().messages({ 'string.empty': `Methodology cannot be an empty` }),
                year: Joi.string().messages({ 'string.empty': `Result cannot be an empty` }),
                accessDate: Joi.string().messages({ 'string.empty': `Access date cannot be an empty` }),
                url: Joi.string().required().messages({ 'string.empty': `Discussion cannot be an empty`, 'any.required': `Please provide a valid URL` }),
                original_text: Joi.optional(),
            }).options({ abortEarly: false });

            data = {
                title: articleRevisionData?.title,
                type: articleRevisionData?.type,
                year: articleRevisionData?.year,
                accessDate: articleRevisionData?.accessDate,
                original_text: articleRevisionData?.original_text,
                url: articleRevisionData?.url,
            }
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
                original_text: Joi.optional(),
            }).keys({
                doi: Joi.string().messages({ 'string.empty': `Please provide a valid DOI` }),
                url: Joi.string().messages({ 'string.empty': `Please provide a valid URL` }),
            }).or('doi', 'url').options({ abortEarly: false });

            data = {
                authors: articleRevisionData?.authors,
                type: articleRevisionData?.type,
                title: articleRevisionData?.title,
                editor: articleRevisionData?.editor,
                publisher: articleRevisionData?.publisher,
                publishLocation: articleRevisionData?.publishLocation,
                year: articleRevisionData?.year,
                original_text: articleRevisionData?.original_text,
                doi: articleRevisionData?.doi,
                url: articleRevisionData?.url,
            }
            break;
    }
    return schema.validate(data);
};

const articleGenerateReferenceDataValidate = (articleRevisionData) => {
    var schema = Joi.object({
                        authors: Joi.optional(),
                        type: Joi.optional(),
                        title: Joi.optional(),
                        journal: Joi.optional(),
                        volume: Joi.optional(),
                        issue: Joi.optional(),
                        pages: Joi.optional(),
                        year: Joi.optional(),
                        original_text: Joi.optional(),
                    }).options({ abortEarly: false });
    return schema.validate(articleRevisionData);
};


// export model
module.exports = { ArticleRevisionData, articleRevisionDataValidate, articleRevisionDataUpdateValidate, articleRevisionReferenceDataValidate, articleGenerateReferenceDataValidate, articleRevisionValidateAlreadyExist };
