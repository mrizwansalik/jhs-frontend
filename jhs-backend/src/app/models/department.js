// third party import
const mongoose = require('mongoose');
const Joi = require("joi");

// access schema from mongoose
const Schema = mongoose.Schema;

// create Object of schema for department
const departmentSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            index: true,
            unique: true,
            sparse: true
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
departmentSchema.pre('save', function (next) {
    let department = this;
    if (typeof (department.email) != 'undefined') {
        department.email = department.email.replace(/ /g, "").toLowerCase();
    }
    next();
});

// define schema pre set rule for update operation
departmentSchema.pre('findOneAndUpdate', async function (next) {
    let department = this._update;
    if (typeof (department.email) != 'undefined') {
        this._update.email = department.email.replace(/ /g, "").toLowerCase();
    }
    next();
});

// create mongoose model from schema
const Department = mongoose.model("department", departmentSchema);

// validator for adding any department
const departmentValidate = (department) => {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            'string.empty': `Name cannot be an empty`,
            'any.required': `Name is a required`,
        }),
        email: Joi.string().email().messages({'string.empty': `Email cannot be an empty`}),
        phone: Joi.string().messages({'string.empty': `Phone cannot be an empty`}),
        address: Joi.string().messages({'string.empty': `Address name cannot be an empty`}),
        city: Joi.string().messages({'string.empty': `City name cannot be an empty`}),
        country: Joi.string().messages({'string.empty': `Country name cannot be an empty`}),
    }).options({ abortEarly: false });
    return schema.validate(department);
};

// validator for updating and department
const departmentUpdateValidate = (department) => {
    const schema = Joi.object({
        name: Joi.string().messages({'string.empty': `Name cannot be an empty`}),
        email: Joi.string().email().messages({'string.empty': `Email cannot be an empty`}),
        phone: Joi.string().messages({'string.empty': `Phone cannot be an empty`}),
        address: Joi.string().messages({'string.empty': `Address name cannot be an empty`}),
        city: Joi.string().messages({'string.empty': `City name cannot be an empty`}),
        country: Joi.string().messages({'string.empty': `Country name cannot be an empty`}),
    }).options({ abortEarly: false });
    return schema.validate(department);
};

// export model
module.exports = {Department, departmentValidate, departmentUpdateValidate};
