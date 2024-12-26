// third party import
const mongoose = require('mongoose');
const Joi = require("joi");

// access schema from mongoose
const Schema = mongoose.Schema;

// create Object of schema for ar
const articleMetaSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
            index: true,
            lowercase: true,
            trim: true,
        },
        volume: {
            type: String,
            required: true,
            index: true,
            lowercase: true,
            trim: true,
        },
        year: {
            type: String,
            required: true,
            index: true,
            lowercase: true,
            trim: true,
        },
        issue: {
            type: String,
            required: true,
            index: true,
            lowercase: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// define schema pre set rule for save operation
articleMetaSchema.pre('save', function (next) {
    let articleMeta = this;
    if (typeof (articleMeta.slug) != 'undefined') {
        articleMeta.slug = articleMeta.slug.replace(/ /g, "").toLowerCase();
    } // end if
    next();
});

// define schema pre set rule for update operation
articleMetaSchema.pre('findOneAndUpdate', async function (next) {
    let articleMeta = this._update;
    if (typeof (articleMeta.slug) != 'undefined') {
        this._update.slug = articleMeta.slug.replace(/ /g, "").toLowerCase();
    }
    next();
});

// create mongoose model from schema
const ArticleMeta = mongoose.model("articleMeta", articleMetaSchema);

// validator for adding any article status
const articleMetaValidate = (articleMeta) => {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            'string.empty': `Name cannot be an empty`,
            'any.required': `Name is a required`,
        }),
        slug: Joi.string().messages({'string.empty': `slug cannot be an empty`}),
        volume: Joi.number().messages({ message: 'Volume must be a valid number' }),
        year: Joi.number().messages({ message: 'Year must be a valid number' }),
        issue: Joi.number().messages({ message: 'Issue must be a valid number' }),
    }).options({ abortEarly: false });
    return schema.validate(articleMeta);
};

// validator for updating and article status
const articleMetaUpdateValidate = (articleMeta) => {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            'string.empty': `Name cannot be an empty`,
            'any.required': `Name is a required`,
        }),
        slug: Joi.string().messages({'string.empty': `slug cannot be an empty`}),
    }).options({ abortEarly: false });
    return schema.validate(articleMeta);
};

// export model
module.exports = {ArticleMeta, articleMetaValidate, articleMetaUpdateValidate};
