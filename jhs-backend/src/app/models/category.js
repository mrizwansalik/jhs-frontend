// third party import
const mongoose = require('mongoose');
const Joi = require("joi");

// access schema from mongoose
const Schema = mongoose.Schema;

// create Object of schema for category
const categorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            index: true,
            unique: true,
            sparse: true
        },
        description: {
            type: String,
            default: null,
        },
        select: {
            type: Number,
            default: 0,
            required: true,
        },
        no_of_publications: {
            type: Number,
            default: 0,
            required: true,
        },
        publications: [{
            type: Schema.Types.ObjectId,
            ref: "articlePublished",
        }],
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
const Category = mongoose.model("category", categorySchema);

// validator for adding any category
const categoryValidate = (category) => {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            'string.empty': `Name cannot be an empty`,
            'any.required': `Name is a required`,
        }),
        description: Joi.string().messages({'string.empty': `Description cannot be an empty`}),
       
    }).options({ abortEarly: false });
    return schema.validate(category);
};

// validator for updating and category
const categoryUpdateValidate = (category) => {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            'string.empty': `Name cannot be an empty`,
            'any.required': `Name is a required`,
        }),
        description: Joi.string().messages({'string.empty': `Description cannot be an empty`}),
    }).options({ abortEarly: false });
    return schema.validate(category);
};

// export model
module.exports = {Category, categoryValidate, categoryUpdateValidate};
