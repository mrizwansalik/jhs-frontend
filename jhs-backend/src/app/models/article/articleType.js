// third party import
const mongoose = require('mongoose');
const Joi = require("joi");

// access schema from mongoose
const Schema = mongoose.Schema;

// create Object of schema for ar
const articleTypeSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        elements: [{
            type: String,
            required: true,
        }],
    },
    {
        timestamps: true,
    }
);

// create mongoose model from schema
const ArticleType = mongoose.model("articleType", articleTypeSchema);

// validator for adding any article status
const articleTypeValidate = (articleType) => {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            'string.empty': `Name cannot be an empty`,
            'any.required': `Name is a required`,
        }),
        elements: Joi.array().items(Joi.string()).messages({ 'string.empty': `Elements list cannot be an empty` }),
    }).options({ abortEarly: false });
    return schema.validate(articleType);
};

// validator for updating and article status
const articleTypeUpdateValidate = (articleType) => {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            'string.empty': `Name cannot be an empty`,
            'any.required': `Name is a required`,
        }),
        elements: Joi.array().items(Joi.string()).messages({ 'string.empty': `Elements list cannot be an empty` }),
    }).options({ abortEarly: false });
    return schema.validate(articleType);
};

// export model
module.exports = {ArticleType, articleTypeValidate, articleTypeUpdateValidate};
