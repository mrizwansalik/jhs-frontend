// third party import
const mongoose = require('mongoose');
const Joi = require("joi");

// access schema from mongoose
const Schema = mongoose.Schema;

// create Object of schema for service
const serviceSchema = new Schema(
    {
        nickTitle: {
            type: String,
            required: true,
        },
        title: {
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
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            default: 0,
            required: true,
        },
        tax: {
            type: Number,
            default: 15,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);



// define schema pre set rule for save operation
serviceSchema.pre('save', function (next) {
    let service = this;
    if (typeof (service.slug) != 'undefined') {
        service.slug = service.slug.replace(/ /g, "").toLowerCase();
    } // end if
    next();
});

// define schema pre set rule for update operation
serviceSchema.pre('findOneAndUpdate', async function (next) {
    let service = this._update;
    if (typeof (service.slug) != 'undefined') {
        this._update.slug = service.slug.replace(/ /g, "").toLowerCase();
    }
    next();
});

// create mongoose model from schema
const Services = mongoose.model("service", serviceSchema);

// validator for adding any service
const serviceValidate = (service) => {
    const schema = Joi.object({
        nickTitle: Joi.string().required().messages({
            'string.empty': `Name cannot be an empty`,
            'any.required': `Name is a required`,
        }),
        title: Joi.string().required().messages({
            'string.empty': `Display Title cannot be an empty`,
            'any.required': `Display Title is a required`,
        }),
        slug: Joi.string().messages({'string.empty': `slug cannot be an empty`}),
        description: Joi.string().messages({'string.empty': `Description cannot be an empty`}),
        price: Joi.number().messages({ message: 'Price must be a valid number' }),
    }).options({ abortEarly: false });
    return schema.validate(service);
};

// validator for updating and service
const serviceUpdateValidate = (service) => {
    const schema = Joi.object({
        nickTitle: Joi.string().required().messages({
            'string.empty': `Name cannot be an empty`,
            'any.required': `Name is a required`,
        }),
        title: Joi.string().required().messages({
            'string.empty': `Name cannot be an empty`,
            'any.required': `Name is a required`,
        }),
        slug: Joi.string().messages({'string.empty': `slug cannot be an empty`}),
        description: Joi.string().messages({'string.empty': `Description cannot be an empty`}),
        price: Joi.number().messages({ message: 'Price must be a valid number' }),
    }).options({ abortEarly: false });
    return schema.validate(service);
};

// export model
module.exports = {Services, serviceValidate, serviceUpdateValidate};
