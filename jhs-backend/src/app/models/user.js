// third party import
const mongoose = require('mongoose');
const Joi = require("joi");
const {joiPasswordExtendCore} = require("joi-password");
const joiPassword = Joi.extend(joiPasswordExtendCore);

const bcrypt = require('bcryptjs');
const { UserReport } = require('./userReport');

// access schema from mongoose
const Schema = mongoose.Schema;

// create Object of schema for user
const userSchema = new Schema(
    {
        username: {
            type: String,
            index: true,
            unique: true,
            sparse: true
        },
        email: {
            type: String,
            required: true,
            index: true,
            unique: true,
            sparse: true
        },
        password: {
            type: String,
            required: true,
            select: false // security
        },
        full_name: {
            type: String,
            default: null,
        },
        first_name: {
            type: String,
            default: null,
        },
        middle_name: {
            type: String,
            default: null,
        },
        last_name: {
            type: String,
            default: null,
        },
        gender: {
            type: String,
            enum : ['Male','Female', 'Other'], // 
            default: 'Male'
        },
        bio: {
            type: String,
            default: null,
        },
        file: {
            type: String,
            default: null,
        },
        language: {
            type: String,
            default: 'en',
        },
        phone: {
            type: String,
            index: true,
            default: null,
        },
        country: {
            type: String,
            index: true,
            default: null,
        },
        time_zone: {
            type: String,
            index: true,
            default: null,
        },
        institute: {
            type: String,
            index: true,
            default: null,
        },
        department: {
            type: String,
            index: true,
            default: null,
        },
        occupation: {
            type: String,
            index: true,
            default: null,
        },
        role: {
            type: String,
            default: 'user',
            required: true
        },
        position: {
            type: String,
            default: 'editor',
            required: true
        },
        verified: {
            type: Boolean,
            default: false,
        },
        allowEmailPromotion: {
            type: Boolean,
            default: false,
        },
        allowPhonePromotion: {
            type: Boolean,
            default: false,
        },
        allowEmailNotification: {
            type: Boolean,
            default: false,
        },
        allowPhoneNotification: {
            type: Boolean,
            default: false,
        },
        userReport: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "userReport",
        },
        active: {
            type: Boolean,
            default: true,
            index: true,
        },
        lastActiveAt: {
            type:Date,
            default:null
       },
    },
    {
        timestamps: true,
    }
);

// define schema method for checking password and confirm password
userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

// define schema pre set rule for save operation
userSchema.pre('save', async function (next) {
    let user = this;
    if (typeof (user.email) != 'undefined') {
        user.email = user.email.replace(/ /g, "").toLowerCase();
    }
    if (typeof (user.username) != 'undefined') {
        user.username = (user.username + user._id).replace(/ /g, "").toLowerCase();
    }

    const userReport = new UserReport({
        user_id: user.id,
    });
    const result = await userReport.save();
    user.userReport = result._id;

    next();
});

// define schema pre set rule for update operation
userSchema.pre('findOneAndUpdate', async function (next) {
    let user = this._update;
    if (typeof (user.email) != 'undefined') {
        this._update.email = user.email.replace(/ /g, "").toLowerCase();
    }
    next();
});

// create mongoose model from schema
const User = mongoose.model("user", userSchema);

// validator for adding any user
const userValidate = (user) => {
    const schema = Joi.object({
        username: Joi.string().messages({
            'string.empty': `username cannot be an empty`
        }),
        email: Joi.string().email().required().messages({'string.empty': `Email cannot be an empty`}),
        first_name: Joi.string().messages({'string.empty': `First name cannot be an empty`}),
        middle_name: Joi.optional(),
        last_name: Joi.string().messages({'string.empty': `Last name cannot be an empty`}),
        gender: Joi.string().messages({'string.empty': `Gender cannot be an empty`}),
        bio: Joi.string().messages({'string.empty': `Bio cannot be an empty`}),
        file: Joi.string().messages({'string.empty': `file cannot be an empty`}),
        language: Joi.string().messages({'string.empty': `Language cannot be an empty`}),
        phone: Joi.optional(),
        country: Joi.string().messages({'string.empty': `Country cannot be an empty`}),
        time_zone: Joi.string().messages({'string.empty': `Time Zone cannot be an empty`}),
        institute: Joi.optional(),
        department: Joi.optional(),
        occupation: Joi.optional(),
        role: Joi.string().messages({'string.empty': `Role cannot be an empty`}),
        position: Joi.string().messages({'string.empty': `Position cannot be an empty`}),
    }).options({ abortEarly: false });
    return schema.validate(user);
};
// validator for adding any user
const userSignUpValidate = (user) => {
    const schema = Joi.object({
        email: Joi.string().email().required().messages({'string.empty': `Email cannot be an empty`}),
        name: Joi.string().messages({'string.empty': `Name cannot be an empty`}),
        password: joiPassword.string()
            .min(4)
            .minOfSpecialCharacters(1)
            .minOfLowercase(1)
            .minOfUppercase(1)
            .minOfNumeric(1)
            .noWhiteSpaces()
            .required()
            .messages({
                'string.empty': `Password cannot be an empty`,
                'string.min': `Password should have a minimum length of {#limit} characters`,
                'any.required': `Password is a required`,
                'any.invalid': `Password must be different from current password`,
                "password.minOfUppercase": 'Password must contain at least one uppercase letter',
                "password.minOfLowercase": 'Password must contain at least one lowercase letter',
                "password.minOfNumeric": 'Password must contain at least one number',
                "password.minOfSpecialCharacters": 'Password must contain at least one special character',
                "password.noWhiteSpaces": 'Password must not contain spaces',
            }),
            confirm_password: Joi.string().valid(Joi.ref('password')).required().messages({
            'string.empty': `Confirm password cannot be an empty`,
            'any.only': `Confirm password must be same as password`,
            'any.required': `Confirm password is a required`,
        }),
        role: Joi.string().messages({'string.empty': `file cannot be an empty`}),
    }).options({ abortEarly: false });
    return schema.validate(user);
};

// validator for updating and user
const userUpdateValidate = (user) => {
    const schema = Joi.object({
        username: Joi.string().messages({'string.empty': `First name cannot be an empty`}),
        email: Joi.string().email().messages({'string.empty': `First name cannot be an empty`}),
        first_name: Joi.string().messages({'string.empty': `First name cannot be an empty`}),
        middle_name: Joi.optional(),
        last_name: Joi.string().messages({'string.empty': `Last name cannot be an empty`}),
        gender: Joi.string().messages({'string.empty': `Gender cannot be an empty`}),
        bio: Joi.string().messages({'string.empty': `Bio cannot be an empty`}),
        file: Joi.string().messages({'string.empty': `Image cannot be an empty`}),
        language: Joi.string().messages({'string.empty': `Language cannot be an empty`}),
        phone: Joi.string().messages({'string.empty': `Phone cannot be an empty`}),
        country: Joi.string().messages({'string.empty': `Country cannot be an empty`}),
        time_zone: Joi.string().messages({'string.empty': `Time Zone cannot be an empty`}),
        institute: Joi.string().messages({'string.empty': `Institute cannot be an empty`}),
        department: Joi.string().messages({'string.empty': `Department cannot be an empty`}),
        occupation: Joi.string().messages({'string.empty': `Occupation cannot be an empty`}),
        role: Joi.string().messages({'string.empty': `Role cannot be an empty`}),
        position: Joi.string().messages({'string.empty': `Position cannot be an empty`}),
    }).options({ abortEarly: false });
    return schema.validate(user);
};

// validator for updating and user
const userUpdatePasswordValidate = (user) => {
    const schema = Joi.object({
        currentPassword: Joi.string()
            .min(4)
            .required()
            .messages({
                'string.empty': `Current password cannot be an empty`,
                'string.min': `Current password should have a minimum length of {#limit} characters`,
                'any.required': `Current password is a required`,
            }),
        newPassword: joiPassword.string()
            .invalid(Joi.ref('currentPassword'))
            .min(4)
            .minOfSpecialCharacters(1)
            .minOfLowercase(1)
            .minOfUppercase(1)
            .minOfNumeric(1)
            .noWhiteSpaces()
            .required()
            .messages({
                'string.empty': `Password cannot be an empty`,
                'string.min': `Password should have a minimum length of {#limit} characters`,
                'any.required': `Password is a required`,
                'any.invalid': `Password must be different from current password`,
                "password.minOfUppercase": 'Password must contain at least one uppercase letter',
                "password.minOfLowercase": 'Password must contain at least one lowercase letter',
                "password.minOfNumeric": 'Password must contain at least one number',
                "password.minOfSpecialCharacters": 'Password must contain at least one special character',
                "password.noWhiteSpaces": 'Password must not contain spaces',
            }),
        confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
            'string.empty': `Confirm password cannot be an empty`,
            'any.only': `Confirm password must be same as password`,
            'any.required': `Confirm password is a required`,
        }),
    }).options({ abortEarly: false });
    return schema.validate(user);
};


// validator for updating and user
const userRestPasswordValidate = (user) => {
    const schema = Joi.object({
        userId: Joi.string()
            .required()
            .messages({
                'string.empty': `User information cannot be an empty`,
                'any.required': `User information is a required`,
            }),
        token: Joi.string()
            .required()
            .messages({
                'string.empty': `Token information cannot be an empty`,
                'any.required': `Token information is a required`,
            }),
        password: joiPassword.string()
            .min(4)
            .minOfSpecialCharacters(1)
            .minOfLowercase(1)
            .minOfUppercase(1)
            .minOfNumeric(1)
            .noWhiteSpaces()
            .required()
            .messages({
                'string.empty': `Password cannot be an empty`,
                'string.min': `Password should have a minimum length of {#limit} characters`,
                'any.required': `Password is a required`,
                "password.minOfUppercase": 'Password must contain at least one uppercase letter',
                "password.minOfLowercase": 'Password must contain at least one lowercase letter',
                "password.minOfNumeric": 'Password must contain at least one number',
                "password.minOfSpecialCharacters": 'Password must contain at least one special character',
                "password.noWhiteSpaces": 'Password must not contain spaces',
            }),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
            'string.empty': `Confirm password cannot be an empty`,
            'any.only': `Confirm password must be same as password`,
            'any.required': `Confirm password is a required`,
        }),
    }).options({ abortEarly: false });
    return schema.validate(user);
};


// export model
module.exports = {User, userValidate, userSignUpValidate, userUpdateValidate, userUpdatePasswordValidate, userRestPasswordValidate};
