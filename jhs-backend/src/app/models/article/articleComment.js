// third party import
const mongoose = require('mongoose');
const Joi = require("joi");

// access schema from mongoose
const Schema = mongoose.Schema;

// create Object of schema for article comment 
const articleCommentSchema = new Schema(
    {
        text: {
            type: String,
            required: true,
        },
        commenterType: {
            type: String,
            required: true,
        },
        addBy: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
            select: false
        },
        uuid: {
            type: String,
            default: null
        },
        highlight:{
            type: String,
            default: null,
        },
        forArticleElement:{
            type: String,
            default: null,
        },
        forArea:{
            type: String,
            default: null,
        },
        startOffset:{
            type: Number,
            default: null,
        },
        endOffset:{
            type:Number,
            default: null,
        },
        replies: [{
            text: { type: String, required: true },
            file: { type: String, default: null },
            type: { type: String, default: 'text' },
            addBy: {
                type: Schema.Types.ObjectId,
                ref: "user",
                required: true,
            },
            repliedAt: { type: Date, required: true, default: new Date() },
        }],
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
        isDeletedAt: {
            type: Date,
            default: null,
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
        isClosed: {
            type: Boolean,
            default: false,
            required: true,
        },
        isClosedBy: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: false,
        },
        isClosedAt: {
            type: Date,
            default: null,
        },
        general: [{
            type: Schema.Types.ObjectId,
            ref: "message",
            required: false,
        }],
        authors: [{
            type: Schema.Types.ObjectId,
            ref: "message",
            required: false,
        }],
        reviewers: [{
            type: Schema.Types.ObjectId,
            ref: "message",
            required: false,
        }],
        reviewers_editors: [{
            type: Schema.Types.ObjectId,
            ref: "message",
            required: false,
        }],
        authors_editors: [{
            type: Schema.Types.ObjectId,
            ref: "message",
            required: false,
        }],
    },
    {
        timestamps: true,
    }
);


// create mongoose model from schema
const ArticleComment = mongoose.model("articleComment", articleCommentSchema);

// validator for adding any articleComment
const articleCommentValidate = (articleComment) => {
    const schema = Joi.object({
        text: Joi.string().required().messages({
            'string.empty': `Comment text cannot be an empty`,
            'any.required': `Comment text is a required`
        }),
        commenterType: Joi.string().required().messages({
            'string.empty': `Commenter Type cannot be an empty`,
            'any.required': `Commenter Type is a required`
        }),
        highlight: Joi.string(),
        forArticleElement: Joi.string(),
        forArea: Joi.string(),
        startOffset: Joi.number(),
        endOffset: Joi.number(),
        addBy: Joi.string().required().messages({
            'string.empty': `Commenter cannot be an empty`,
            'any.required': `Commenter is a required`
        }),
    }).options({ abortEarly: false });
    return schema.validate(articleComment);
};


// export model
module.exports = { ArticleComment, articleCommentValidate };
