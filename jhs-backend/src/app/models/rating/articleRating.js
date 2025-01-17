// third party import
const mongoose = require('mongoose');
const Joi = require("joi");

// access schema from mongoose
const Schema = mongoose.Schema;

const articleRatingSchema = new Schema(
    {
        article_id: { type: Schema.Types.ObjectId, ref: "articlePublished", required: true },
        rater_id: { type: Schema.Types.ObjectId, ref: "user", required: true },
        score: { type: Number, min: 0, max: 5, required: true },
        comment: { type: String },
        rating_list: [{
            rating_item: { type: Schema.Types.ObjectId, ref: "articleRatingList", required: true },
            score: { type: Number, min: 0, max: 5, required: true },
            comment: { type: String },
        }],
        date: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

const ArticleRating = mongoose.model("articleRating", articleRatingSchema);

// validator for updating and rating
const articleRatingValidate = (rating) => {
    const schema = Joi.object({
        article_id: Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/) // Validates MongoDB ObjectId format
            .required()
            .messages({
                'string.pattern.base': `Invalid article format`,
                'string.empty': `Article cannot be empty`,
                'any.required': `Article is required`,
            }),
        rater_id: Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/) // Validates MongoDB ObjectId format
            .required()
            .messages({
                'string.pattern.base': `Invalid Rater format`,
                'string.empty': `Rater cannot be empty`,
                'any.required': `Rater is required`,
            }),
        score: Joi.number()
            .min(0)
            .max(5)
            .required()
            .messages({
                'number.base': `Score must be a number`,
                'number.min': `Score must be at least 0`,
                'number.max': `Score must be at most 5`,
                'any.required': `Score is required`,
            }),
        comment: Joi.string()
            .optional()
            .allow("")
            .messages({
                'string.base': `Comment must be a string`,
            }),
        rating_list: Joi.array()
            .items(
                Joi.object({
                    rating_item: Joi.string()
                        .regex(/^[0-9a-fA-F]{24}$/) // Validates MongoDB ObjectId format
                        .required()
                        .messages({
                            'string.pattern.base': `Invalid Rating Item format`,
                            'string.empty': `Rating Item cannot be empty`,
                            'any.required': `Rating Item is required`,
                        }),
                    score: Joi.number()
                        .min(0)
                        .max(5)
                        .required()
                        .messages({
                            'number.base': `Score must be a number`,
                            'number.min': `Score must be at least 0`,
                            'number.max': `Score must be at most 5`,
                            'any.required': `Score is required`,
                        }),
                    comment: Joi.string()
                        .optional()
                        .allow("")
                        .messages({
                            'string.base': `Comment must be a string`,
                        }),
                })
            )
            .optional()
            .messages({
                'array.base': `Rating List must be an array`,
            }),
    }).options({ abortEarly: false }); // Validates all fields before returning errors
    return schema.validate(rating);
};

module.exports = { ArticleRating, articleRatingValidate };