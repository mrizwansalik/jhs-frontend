// third party import
const mongoose = require('mongoose');
const Joi = require("joi");

// access schema from mongoose
const Schema = mongoose.Schema;

// create Object of schema for company
const companySchema = new Schema(
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
        email: {
            type: String,
            default: null,
        },
        phone: {
            type: String,
            default: null,
        },
        address: {
            type: String,
            default: null,
        },
        city: {
            type: String,
            default: null,
        },
        country: {
            type: String,
            default: null,
        },
        _owner: {
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

// define schema pre set rule for save operation
companySchema.pre('save', function (next) {
    let company = this;
    if (typeof (company.email) != 'undefined') {
        company.email = company.email.replace(/ /g, "").toLowerCase();
    }
    next();
});

// define schema pre set rule for update operation
companySchema.pre('findOneAndUpdate', async function (next) {
    let company = this._update;
    if (typeof (company.email) != 'undefined') {
        this._update.email = company.email.replace(/ /g, "").toLowerCase();
    }
    next();
});

// create mongoose model from schema
const Company = mongoose.model("company", companySchema);

// validator for adding any company
const companyValidate = (company) => {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            'string.empty': `Name cannot be an empty`,
            'any.required': `Name is a required`,
        }),
        description: Joi.string().messages({'string.empty': `Description cannot be an empty`}),
        email: Joi.string().email().messages({'string.empty': `Email cannot be an empty`}),
        phone: Joi.string().messages({'string.empty': `Phone cannot be an empty`}),
        address: Joi.string().messages({'string.empty': `Address name cannot be an empty`}),
        city: Joi.string().messages({'string.empty': `City name cannot be an empty`}),
        country: Joi.string().messages({'string.empty': `Country name cannot be an empty`}),
        _owner: Joi.string().required().messages({
            'string.empty': `Manager information cannot be an empty`,
            'any.required': `Manager information is a required`,
        }),
    }).options({ abortEarly: false });
    return schema.validate(company);
};

// validator for updating and company
const companyUpdateValidate = (company) => {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            'string.empty': `Name cannot be an empty`,
            'any.required': `Name is a required`,
        }),
        description: Joi.string().messages({'string.empty': `Description cannot be an empty`}),
        email: Joi.string().email().messages({'string.empty': `Email cannot be an empty`}),
        phone: Joi.string().messages({'string.empty': `Phone cannot be an empty`}),
        address: Joi.string().messages({'string.empty': `Address name cannot be an empty`}),
        city: Joi.string().messages({'string.empty': `City name cannot be an empty`}),
        country: Joi.string().messages({'string.empty': `Country name cannot be an empty`}),
        _owner: Joi.string().messages({'string.empty': `Owner information cannot be an empty`}),
    }).options({ abortEarly: false });
    return schema.validate(company);
};

// export model
module.exports = {Company, companyValidate, companyUpdateValidate};
