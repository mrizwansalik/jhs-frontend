// import models
const {Department, departmentUpdateValidate, departmentValidate} = require('../models/department');

// import utils (helper functions)
const catchAsync = require('../utils/catchAsync');
const { validateErrorFormatting } = require('../utils/helperFunction');
const { Response } = require('../../framework');
const factory = require('./handleFactory');

// get all departments 
exports.getAllDepartment = factory.getAll(Department);

// get specific departments 
exports.getDepartment = factory.getOne(Department);
exports.getByDepartmentName = factory.getByFiled(Department, "name");

// add new department
exports.addDepartment = catchAsync(async (req, res, next) => {
    const body = req.body;
    // validate request body using Joi Validation define in Department Mongoes models
    const {error} = departmentValidate(body);
    if (error) {
        return res.status(422).json(
            Response.validation({ data: validateErrorFormatting(error) })
        );
    }
    // create new Department object
    const department = new Department(body);
    // adding department in db using mongoes department Object
    const result = await department.save();

    // set response with department and JWT token
    res.status(200).json(
        Response.success({ 
            message: "Department created!",
            status: 200,
            data: result,
            accessToken: req.token,
        })
    );
});

// update specific department
exports.updateDepartment = catchAsync(async (req, res, next) => {
    // validate request body using Joi Validation define in Department Mongoes models
    const {error} = departmentUpdateValidate(req.body);
    if (error) {
        return res.status(422).json(
            Response.validation({ data: validateErrorFormatting(error) })
        );
    } // end if
    // find department and update
    const departmentId = req.params.departmentId;
    const result = await Department.findByIdAndUpdate(
        departmentId,
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
            message: 'Department updated!',
            status: 200,
            data: result,
            accessToken: req.token,
        })
    );
});

// deactivate specific department
exports.deactivateDepartment = catchAsync(async (req, res, next) => {
    const result = await Department.findByIdAndUpdate(
        req.params.id,
        {
            active: false,
        },
        {new: false, runValidators: true, returnOriginal: false}
    );
    res.status(200).json(
        Response.success({ 
            message: 'Department Deactivated!',
            status: 200,
            data: result,
            accessToken: req.token,
        })
    );
});

// activate specific department
exports.activateDepartment = catchAsync(async (req, res, next) => {
    const result = await Department.findByIdAndUpdate(
        req.params.id,
        {
            active: true,
        },
        {new: false, runValidators: true, returnOriginal: false}
    );
    res.status(200).json(
        Response.success({ 
            message: 'Department Activated!',
            status: 200,
            data: result,
            accessToken: req.token,
        })
    );
});