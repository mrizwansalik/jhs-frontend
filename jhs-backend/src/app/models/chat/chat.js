// third party import
const mongoose = require('mongoose');
const Joi = require("joi");

// access schema from mongoose
const Schema = mongoose.Schema;

// create Object of schema for chat
const chatSchema = new Schema(
    {
        title: {
            type: String,
            require: true,
        },
        slug: {
            type: String,
        },
        user: [{
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
        }],
        article: {
            type: Schema.Types.ObjectId,
            ref: "article",
        },
        isClosed: {
            type: Boolean,
            default: false,
            required: true,
        },
        isClosedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// define schema pre set rule for save operation
chatSchema.pre('save', async function (next) {
    let chat = this;
    if (typeof (chat.slug) == 'undefined') {
        chat.slug = chat.title.replace(/ /g, "-").toLowerCase() + "-" + chat._id.toString();
    }
    next();
});

// define schema pre set rule for update operation
chatSchema.pre('findOneAndUpdate', async function (next) {
    let chat = this._update;
    if (typeof (chat.slug) != 'undefined') {
        this._update.slug = chat.slug.replace(/ /g, "-").toLowerCase();
    }
    next();
});

// create mongoose model from schema
const Chat = mongoose.model("chat", chatSchema);

// validator for adding any chat
const chatValidate = (chat) => {
    const schema = Joi.object({
        title: Joi.string(),
        article: Joi.object(),
    }).options({ abortEarly: false });
    return schema.validate(chat);
};

// validator for updating and chat
const chatUpdateValidate = (chat) => {
    const schema = Joi.object({
        title: Joi.string().required(),
    }).options({ abortEarly: false });
    return schema.validate(chat);
};

// export model
module.exports = { Chat, chatValidate, chatUpdateValidate };
