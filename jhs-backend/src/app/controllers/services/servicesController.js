// import models
const {Services, serviceUpdateValidate, serviceValidate} = require('../../models/services/services');

// import utils (helper functions)
const catchAsync = require('../../utils/catchAsync');
const { validateErrorFormatting } = require('../../utils/helperFunction');
const { Response } = require('../../../framework');
const factory = require('../handleFactory');

// get all article Status
exports.getAllServices = factory.getAll(Services);

// get specific article Status
exports.getServices = factory.getOne(Services);

// add new service
exports.addServices = catchAsync(async (req, res, next) => {
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
    const service = new Services(data);
    // adding article Status in db using mongoes service Object
    const result = await service.save();

    // set response with services and JWT token
    res.status(200).json(
        Response.success({ 
            status: 200,
            message: "Services information created!",
            data: result,
            accessToken: req.token,
        })
    );
});

// update specific services
exports.updateServices = catchAsync(async (req, res, next) => {
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

    // find services and update
    const serviceId = req.params.serviceId;
    const result = await Services.findByIdAndUpdate(
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
            message: 'Services information updated!',
            data: result,
            accessToken: req.token,
        })
    );
});
