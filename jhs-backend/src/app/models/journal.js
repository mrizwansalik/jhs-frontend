// third party import
const mongoose = require('mongoose');
const Joi = require("joi");

// access schema from mongoose
const Schema = mongoose.Schema;

// create Object of schema for journal
const journalSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            index: true,
            unique: true,
            sparse: true
        },
        shortName: {
            type: String,
            required: true,
            uppercase: true,
            index: true,
            unique: true,
            sparse: true
        },
        logo: {
            type: String,
            default: null,
        },
        type: {
            type: String,
            required: true,
        },
        eISSN: {
            type: String,
            required: true,
        },
        pISSN: {
            type: String,
            required: true,
        },
        doiPrefix: {
            type: String,
            required: true,
        },
        nextDoiNumberSequence: {
                type: Number,
                default: 1,
        },
        nextArticleNumberSequence: {
                type: Number,
                default: 1
        },
        _manageBy: {
            type: Schema.Types.ObjectId,
            ref: "user",
        },
        active: {
            type: Boolean,
            default: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

// create mongoose model from schema
const Journal = mongoose.model("journal", journalSchema);

// validator for adding any journal
const journalValidate = (journal) => {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            'string.empty': `Name cannot be an empty`,
            'any.required': `Name is a required`,
        }),
        shortName: Joi.string().required().messages({
            'string.empty': `Short Name cannot be an empty`,
            'any.required': `Short Name is a required`,
        }),
        logo: Joi.string().messages({'string.empty': `logo cannot be an empty`}),
        type: Joi.string().messages({'string.empty': `Type cannot be an empty`}),
        eISSN: Joi.string().required().messages({
            'string.empty': `eISSN cannot be an empty`,
            'any.required': `eISSN is a required`
        }),
        pISSN: Joi.string().required().messages({
            'string.empty': `pISSN cannot be an empty`,
            'any.required': `pISSN is a required`
        }),
        doiPrefix: Joi.string().required().messages({
            'string.empty': `DOI Prefix cannot be an empty`,
            'any.required': `DOI Prefix is a required`
        }),
        _manageBy: Joi.string().required().messages({
            'string.empty': `Manager information cannot be an empty`,
            'any.required': `Manager information is a required`,
        }),
        nextDoiNumberSequence: Joi.optional(),
        nextArticleNumberSequence: Joi.optional(),
    });
    return schema.validate(journal);
};

// validator for updating and journal
const journalUpdateValidate = (journal) => {
    const schema = Joi.object({
        name: Joi.string().required().messages({'string.empty': `Name cannot be an empty`}),
        shortName: Joi.string().required().messages({'string.empty': `Short Name cannot be an empty`}),
        logo: Joi.string().messages({'string.empty': `logo cannot be an empty`}),
        type: Joi.string().messages({'string.empty': `Type cannot be an empty`}),
        eISSN: Joi.string().required().messages({'string.empty': `eISSN cannot be an empty`}),
        pISSN: Joi.string().required().messages({'string.empty': `pISSN cannot be an empty`}),
        doiPrefix: Joi.string().required().messages({'string.empty': `DOI Prefix cannot be an empty`}),
        _manageBy: Joi.string().messages({'string.empty': `Manager information cannot be an empty`}),
        nextDoiNumberSequence: Joi.optional(),
        nextArticleNumberSequence: Joi.optional(),
    }).options({ abortEarly: false });
    return schema.validate(journal);
};

// export model
module.exports = {Journal, journalValidate, journalUpdateValidate};
