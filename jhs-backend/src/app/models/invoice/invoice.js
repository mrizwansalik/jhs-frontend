// third party import
const mongoose = require('mongoose');

// access schema from mongoose
const Schema = mongoose.Schema;

// create Object of schema for invoice Status
const invoiceSchema = new Schema(
    {
        invoiceNumber: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            default: new Date,
            required: true,
        },
        currency: {
            type: String,
            default: 'sar',
            required: true,
        },
        taxNotation: {
            type: String,
            default: 'vat',
            required: true,
        },
        taxType: {
            // inclusive or exclusive
            type: String,
            default: 'inclusive',
            required: true,
        },
        services: [{
                title: {
                        type: String,
                        default: "",
                        required: true,
                },
                description: {
                        type: String,
                        default: "",
                        required: true,
                },
                price: {
                        type: Number,
                        default: 0,
                        required: true,
                },
                taxPercentage: {
                    type: Number,
                    default: 0,
                    required: true,
                },
                tax: {
                    type: Number,
                    default: 0,
                    required: true,
                },
                total: {
                    type: Number,
                    default: 0,
                    required: true,
                },
            }],
        total: {
            type: Number,
        },
        totalTax: {
            type: Number,
            default: 0,
            required: true,
        },
        grandTotal: {
            type: Number,
            default: 0,
            required: true,
        },
        client: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        status: {
            // -1 pending, 0 fail, 1 pass, 2 revised
            type: Number,
            default: -1,
            required: true,
        },
        payment: {
            type: Schema.Types.ObjectId,
            ref: "payment",
            required: false,
        },
    },
    {
        timestamps: true,
    }
);


// create mongoose model from schema
const Invoice = mongoose.model("invoice", invoiceSchema);

// export model
module.exports = { Invoice };
