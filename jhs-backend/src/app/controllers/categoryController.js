// import models
const {Category, categoryUpdateValidate, categoryValidate} = require('../models/category');

// import utils (helper functions)
const catchAsync = require('../utils/catchAsync');
const { validateErrorFormatting } = require('../utils/helperFunction');
const { Response } = require('../../framework');
const factory = require('./handleFactory');

// get all categories 
exports.getAllCategory = factory.getAll(Category);

// get specific categories 
exports.getCategory = factory.getOne(Category);
exports.getByCategoryName = factory.getByFiled(Category, "name");

// add new category
exports.addCategory = catchAsync(async (req, res, next) => {
    const body = req.body;
    // validate request body using Joi Validation define in Category Mongoes models
    const {error} = categoryValidate(body);
    if (error) {
        return res.status(422).json(
            Response.validation({ data: validateErrorFormatting(error) })
        );
    }
    // create new Category object
    const category = new Category(body);
    // adding category in db using mongoes category Object
    const result = await category.save();

    // set response with category and JWT token
    res.status(200).json(
        Response.success({ 
            message: "Category created!",
            status: 200,
            data: result,
            accessToken: req.token,
        })
    );
});

// update specific category
exports.updateCategory = catchAsync(async (req, res, next) => {
    // validate request body using Joi Validation define in Category Mongoes models
    const {error} = categoryUpdateValidate(req.body);
    if (error) {
        return res.status(422).json(
            Response.validation({ data: validateErrorFormatting(error) })
        );
    } // end if
    // find category and update
    const categoryId = req.params.categoryId;
    const result = await Category.findByIdAndUpdate(
        categoryId,
        req.body,
        {
            new: false,
            runValidators: true,
            returnOriginal: false
        }
    );
    // send success response
    res.status(200).json(
        Response.success({ 
            message: 'Category updated!',
            status: 200,
            data: result,
            accessToken: req.token,
        })
    );
});

// deactivate specific category
exports.deactivateCategory = catchAsync(async (req, res, next) => {
    const result = await Category.findByIdAndUpdate(
        req.params.id,
        {
            active: false,
        },
        {new: false, runValidators: true, returnOriginal: false}
    );
    res.status(200).json(
        Response.success({ 
            message: 'Category Deactivated!',
            status: 200,
            data: result,
            accessToken: req.token,
        })
    );
});

// activate specific category
exports.activateCategory = catchAsync(async (req, res, next) => {
    const result = await Category.findByIdAndUpdate(
        req.params.id,
        {
            active: true,
        },
        {new: false, runValidators: true, returnOriginal: false}
    );
    res.status(200).json(
        Response.success({ 
            message: 'Category Activated!',
            status: 200,
            data: result,
            accessToken: req.token,
        })
    );
});