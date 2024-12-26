// third party import
const mongoose = require('mongoose');
const Joi = require("joi");

// access schema from mongoose
const Schema = mongoose.Schema;

// create Object of schema for chat content
const messageSchema = new Schema(

    {
        chatusers: {
            type: [{
                type: mongoose.Types.ObjectId,
                ref: "User"
            }],
            required: true,
        },
        message: {
            type: String,
            required: true
        },
        sender: {
            type: String,
            required: true
        },
        uuid: {
            type: String,
            default: null
        },
        lastMessageViewed: {
            type: String,
            default: null
        },
        type: {
            type: String,
            default: null
        },
        belongsTo: {
            type: String,
            default: 'chat',
            enum: ['chat', "comment", "discussion"]
        },
        file: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true, versionKey: false
    }
);

// create mongoose model from schema
const Message = mongoose.model("message", messageSchema);

// validator for adding any chat content
// const messageValidate = (chat) => {
//     const schema = Joi.object({
//         text: Joi.string(),
//         file: Joi.string(),
//         images: Joi.string(),
//         sender: Joi.string(),
//     }).options({ abortEarly: false });
//     return schema.validate(chat);
// };

// validator for updating and chat content
// const messageUpdateValidate = (chat) => {
//     const schema = Joi.object({
//         text: Joi.string(),
//     }).options({ abortEarly: false });
//     return schema.validate(chat);
// };

// export model
module.exports = {
    Message,
    //   messageValidate, 
    //   messageUpdateValidate 
};
