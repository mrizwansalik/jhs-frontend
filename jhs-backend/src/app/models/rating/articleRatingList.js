// third party import
const mongoose = require('mongoose');
const Joi = require("joi");

// access schema from mongoose
const Schema = mongoose.Schema;

const articleRatingListSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            index: true,
        },
        description: {
            type: String,
            default: null,
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

const ArticleRatingList = mongoose.model("articleRatingList", articleRatingListSchema);

// validator for adding any category
const articleRatingListValidate = (category) => {
    const schema = Joi.object({
        title: Joi.string().required().messages({
            'string.empty': `Title cannot be an empty`,
            'any.required': `Title is a required`,
        }),
        description: Joi.string().messages({'string.empty': `Description cannot be an empty`}),
       
    }).options({ abortEarly: false });
    return schema.validate(category);
};

// validator for updating and category
const articleRatingListUpdateValidate = (category) => {
    const schema = Joi.object({
        title: Joi.string().required().messages({
            'string.empty': `Title cannot be an empty`,
            'any.required': `Title is a required`,
        }),
        description: Joi.string().messages({'string.empty': `Description cannot be an empty`}),
    }).options({ abortEarly: false });
    return schema.validate(category);
};

module.exports = { ArticleRatingList, articleRatingListValidate, articleRatingListUpdateValidate };