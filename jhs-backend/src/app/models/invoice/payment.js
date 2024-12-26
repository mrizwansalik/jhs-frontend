// third party import
const mongoose = require('mongoose');

// access schema from mongoose
const Schema = mongoose.Schema;

// create Object of schema for payment Status
const paymentSchema = new Schema(
    {
        paymentNumber: {
            type: String,
        },
        date: {
            type: String,
        },
        paidAmount: {
            type: Number,
        },
        paidBy: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);


// create mongoose model from schema
const Payment = mongoose.model("payment", paymentSchema);

// export model
module.exports = { Payment };
