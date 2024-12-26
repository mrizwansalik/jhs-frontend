// import models
const {Invoice, serviceUpdateValidate, serviceValidate} = require('../../models/invoice/invoice');

// import utils (helper functions)
const catchAsync = require('../../utils/catchAsync');
const { validateErrorFormatting } = require('../../utils/helperFunction');
const { Response } = require('../../../framework');
const factory = require('../handleFactory');

// get all article Status
exports.getAllInvoice = factory.getAll(Invoice);
exports.getAllInvoiceWithClient = factory.getAll(Invoice, "client");

// get specific article Status
exports.getInvoice = factory.getOne(Invoice);

// add new service
exports.addInvoice = catchAsync(async (req, res, next) => {
    const nickTitle = req.body.nickTitle;
    const title = req.body.title;
    const slug = title.replace(/(\r\n|\n|\r| )/gm, "");
    const description = req.body.description;
    const price = req.body.price;

    const data = {
        nickTitle: nickTitle,
        title: title,
        slug: slug,
        description: description,
        price: price,
    }

    // validate request body using Joi Validation define in Article Status Mongoes models
    const {error} = serviceValidate(data);
    if (error) {
        return res.status(422).json(
            Response.validation({ data: validateErrorFormatting(error) })
        );
    } // end if

    // create new Article Status object
    const service = new Invoice(data);
    // adding article Status in db using mongoes service Object
    const result = await service.save();

    // set response with invoice and JWT token
    res.status(200).json(
        Response.success({ 
            status: 200,
            message: "Invoice information created!",
            data: result,
            accessToken: req.token,
        })
    );
});

// update specific invoice
exports.updateInvoice = catchAsync(async (req, res, next) => {
    const nickTitle = req.body.nickTitle;
    const title = req.body.title;
    const slug = title.replace(/(\r\n|\n|\r| )/gm, "");
    const description = req.body.description;
    const price = req.body.price;

    const data = {
        nickTitle: nickTitle,
        title: title,
        slug: slug,
        description: description,
        price: price,
    }

    // validate request body using Joi Validation define in Service Mongoes models
    const {error} = serviceUpdateValidate(data);
    if (error) {
        return res.status(422).json(
            Response.validation({ data: validateErrorFormatting(error) })
        );
    } // end if

    // find invoice and update
    const serviceId = req.params.serviceId;
    const result = await Invoice.findByIdAndUpdate(
        serviceId,
        data,
        {
            new: false,
            runValidators: true,
            returnOriginal: false
        }
    );
    // send success response
    res.status(200).json(
        Response.success({ 
            status: 200,
            message: 'Invoice information updated!',
            data: result,
            accessToken: req.token,
        })
    );
});
