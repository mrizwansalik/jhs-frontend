// third party import
const mongoose = require('mongoose');
const Joi = require("joi");

// access schema from mongoose
const Schema = mongoose.Schema;

// create Object of schema for ar
const articleStatusSchema = new Schema(
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
        type: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        payment: {
            type: Boolean,
            required: true,
            default: false,
        },
        parentStatus: {
            type: Schema.Types.ObjectId,
            ref: "articleStatus",
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

// define schema pre set rule for save operation
articleStatusSchema.pre('save', function (next) {
    let articleStatus = this;
    if (typeof (articleStatus.slug) != 'undefined') {
        articleStatus.slug = articleStatus.slug.replace(/ /g, "").toLowerCase();
    } // end if
    next();
});

// define schema pre set rule for update operation
articleStatusSchema.pre('findOneAndUpdate', async function (next) {
    let articleStatus = this._update;
    if (typeof (articleStatus.slug) != 'undefined') {
        this._update.slug = articleStatus.slug.replace(/ /g, "").toLowerCase();
    }
    next();
});

// create mongoose model from schema
const ArticleStatus = mongoose.model("articleStatus", articleStatusSchema);

// validator for adding any article status
const articleStatusValidate = (articleStatus) => {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            'string.empty': `Name cannot be an empty`,
            'any.required': `Name is a required`,
        }),
        type: Joi.string().required().messages({
            'string.empty': `Type cannot be an empty`,
            'any.required': `Type is a required`,
        }),
        slug: Joi.string().messages({'string.empty': `slug cannot be an empty`}),
        payment: Joi.boolean().messages({'string.empty': `payment cannot be an empty`}),
        message: Joi.string().required().messages({
            'string.empty': `Messages information cannot be an empty`,
            'any.required': `Messages information is a required`
        }),
        parentStatus: Joi.optional(),
    }).options({ abortEarly: false });
    return schema.validate(articleStatus);
};

// validator for updating and article status
const articleStatusUpdateValidate = (articleStatus) => {
    const schema = Joi.object({
        name: Joi.string().messages({'string.empty': `Name cannot be an empty`}),
        type: Joi.string().required().messages({'string.empty': `Type cannot be an empty`}),
        slug: Joi.string().messages({'string.empty': `slug cannot be an empty`}),
        payment: Joi.boolean().messages({'string.empty': `payment cannot be an empty`}),
        message: Joi.string().messages({'string.empty': `Messages information cannot be an empty`}),
        parentStatus: Joi.optional(),
    }).options({ abortEarly: false });
    return schema.validate(articleStatus);
};

// export model
module.exports = {ArticleStatus, articleStatusValidate, articleStatusUpdateValidate};
