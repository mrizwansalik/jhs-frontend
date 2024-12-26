// third party import
const mongoose = require('mongoose');
const Joi = require("joi");

// access schema from mongoose
const Schema = mongoose.Schema;

// create Object of schema for employee
const employeeSchema = new Schema(
    {
        name: {
            type: String,
            index: true,
            sparse: true
        },
        email: {
            type: String,
            default: null,
            index: true,
            sparse: true
        },
        position: {
            type: String,
            default: null,
        },
        _employee_id: {
            type: Schema.Types.ObjectId,
            ref: "user",
            index: {
                unique: true
            }
        },
        _reporting_to: {
            type: Schema.Types.ObjectId,
            ref: "user",
        },
    },
    {
        timestamps: true,
    }
);

// define schema pre set rule for save operation
employeeSchema.pre('save', function (next) {
    let employee = this;
    if (typeof (employee.email) != 'undefined') {
        employee.email = employee.email.replace(/ /g, "").toLowerCase();
    }
    next();
});

// define schema pre set rule for update operation
employeeSchema.pre('findOneAndUpdate', async function (next) {
    let employee = this._update;
    if (typeof (employee.email) != 'undefined') {
        this._update.email = employee.email.replace(/ /g, "").toLowerCase();
    }
    next();
});

// create mongoose model from schema
const Employee = mongoose.model("employee", employeeSchema);

// validator for adding any employee
const employeeValidate = (employee) => {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            'string.empty': `Name cannot be an empty`,
            'any.required': `Name is a required`,
        }),
        email: Joi.string().email().messages({'string.empty': `Email cannot be an empty`}),
        position: Joi.string().messages({'string.empty': `Position cannot be an empty`}),
        _employee_id: Joi.object().messages({'string.empty': `Manager information cannot be an empty`}),
        _reporting_to: Joi.object().required().messages({
            'string.empty': `Manager information cannot be an empty`,
            'any.required': `Manager information is a required`,
        }),
    }).options({ abortEarly: false });
    return schema.validate(employee);
};

// validator for updating and employee
const employeeUpdateValidate = (employee) => {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            'string.empty': `Name cannot be an empty`,
            'any.required': `Name is a required`,
        }),
        email: Joi.string().email().messages({'string.empty': `Email cannot be an empty`}),
        position: Joi.string().messages({'string.empty': `Position cannot be an empty`}),
        _employee_id: Joi.object().required().messages({'string.empty': `Employee information cannot be an empty`}),
        _reporting_to: Joi.object().required().messages({
            'string.empty': `Reporting to information cannot be an empty`,
            'any.required': `Reporting to information is a required`,
        }),
    }).options({ abortEarly: false });
    return schema.validate(employee);
};

// export model
module.exports = {Employee, employeeValidate, employeeUpdateValidate};
