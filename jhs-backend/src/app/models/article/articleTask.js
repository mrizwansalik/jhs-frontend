// third party import
const mongoose = require('mongoose');
const Joi = require("joi");

// access schema from mongoose
const Schema = mongoose.Schema;

// create Object of schema for article comment 
const articleTaskSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        taskType: {
            type: Schema.Types.ObjectId,
            ref: "articleStatus",
            required: false,
        },
        isEdited: {
            type: Boolean,
            default: false,
            required: true,
        },
        isCompleted: {
            type: Boolean,
            default: false,
            required: true,
        },
        isCompletedAt: {
            type: Date,
            default: null,
        },
        isDone: {
            type: Boolean,
            default: false,
            required: true,
        },
        isDoneAt: {
            type: Date,
            default: null,
        },
        article: {
            type: Schema.Types.ObjectId,
            ref: "article",
            required: true,
        },
        addBy: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        assignedTo: [{
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
        }],
        dueDate: {
            type: Date,
            default: new Date(),
        },
        change_editor: [{
            request: { type: String, required: true },
            reason:  { type: String, required: true },
            editor: {
                type: Schema.Types.ObjectId,
                ref: "user",
                required: false,
            },
            newEditor: {
                type: Schema.Types.ObjectId,
                ref: "user",
                default: null,
            },
            date: { type: Date, required: true, default: new Date(), },
            status:  { type: Number, default: -1, }, // -1 pending, 1 approved, 0 rejected
            actionBy: {
                type: Schema.Types.ObjectId,
                ref: "user",
                default: null,
            },
            approvedAt: { type: Date, default: null, },
            rejectedAt: { type: Date, default: null, },
        }],
        comment: [{
            text: {
                type: String,
                required: true,
            },
            isEdited: {
                type: Boolean,
                default: false,
                required: true,
            },
            isDeleted: {
                type: Boolean,
                default: false,
                required: true,
            },
            commentBy: {
                type: Schema.Types.ObjectId,
                ref: "user",
                required: true,
            },
            commentAt: {
                type: Date,
                default: new Date(),
            }
        }]
    },
    {
        timestamps: true,
    }
);


// create mongoose model from schema
const ArticleTask = mongoose.model("articleTask", articleTaskSchema);

// validator for adding any articleTask
const articleTaskValidate = (articleTask) => {
    const schema = Joi.object({
        title: Joi.string().required().messages({
            'string.empty': `Task title cannot be an empty`,
            'any.required': `Task title is a required`
        }),
        description: Joi.string().required().messages({
            'string.empty': `Task description cannot be an empty`,
            'any.required': `Task description is a required`
        }),
        taskType: Joi.string().optional().messages({
            'string.empty': `Task type cannot be an empty`,
            'any.required': `Task type is a required`
        }),
        assignedTo: Joi.array().items(Joi.string()).messages({ 'string.empty': `Author cannot be an empty` }),
    }).options({ abortEarly: false });
    return schema.validate(articleTask);
};

// validator for adding comment on any article Task
const articleTaskCommentValidate = (articleTaskComment) => {
    const schema = Joi.object({
        text: Joi.string().required().messages({
            'string.empty': `Comment text cannot be an empty`,
            'any.required': `Comment text is a required`
        }),
        commentBy: Joi.string().required().messages({
            'string.empty': `User cannot be an empty`,
            'any.required': `User is a required`
        }),
    }).options({ abortEarly: false });
    return schema.validate(articleTaskComment);
};

// validator for adding comment on any article Task
const addChangeRequestValidate = (articleRequestData) => {
    const schema = Joi.object({
        request: Joi.string().required().messages({
            'string.empty': `Request cannot be an empty`,
            'any.required': `Request is a required`
        }),
        reason: Joi.string().required().messages({
            'string.empty': `Request reason cannot be an empty`,
            'any.required': `Request reason is a required`
        }),
    }).options({ abortEarly: false });
    return schema.validate(articleCommentData);
};


// export model
module.exports = { ArticleTask, articleTaskValidate, articleTaskCommentValidate, addChangeRequestValidate };
