// import models
const { Employee, employeeUpdateValidate, employeeValidate } = require('../models/employee');
const { User } = require('../models/user');

// import utils (helper functions)
const catchAsync = require('../utils/catchAsync');
const { validateErrorFormatting } = require('../utils/helperFunction');
const { Response } = require('../../framework');
const factory = require('./handleFactory');

// get specific employee
exports.getEmployee = factory.getOne(Employee);
exports.getEmployeeWithDetail = factory.getOne(Employee, ['_employee_id', '_reporting_to']);

// get all employee
exports.getAllEmployee = factory.getAll(Employee);
exports.getAllEmployeeWithDetail = factory.getAll(Employee, ['_employee_id', '_reporting_to']);

// add new employee
exports.assignEmployee = catchAsync(async (req, res) => {
    const employeeID = req.body.employee_id;
    const employee = await User.findById(employeeID);
    if (!employee) {
        // return with error of user not found in db
        return res.status(404).json(
            Response.notFound({ message: `Employee with this id could not be found.` })
        );
    } // end if

    const reportingToID = req.body.reporting_to_id;
    const reportingTo = await User.findById(reportingToID);
    if (!reportingTo) {
        // return with error of user not found in db
        return res.status(404).json(
            Response.notFound({ message: `Reporting to user with this id could not be found.` })
        );
    } // end if

    // create data for insertion
    const data = {
        name: (employee?.full_name)?.toLowerCase(),
        email: employee.email,
        position: req.body.position,
        _employee_id: employeeID,
        _reporting_to: reportingToID,
    }

    // validate request body using Joi Validation define in Employee Mongoes models
    const { error } = employeeValidate(data);
    if (error) {
        return res.status(422).json(
            Response.validation({ data: validateErrorFormatting(error) })
        );
    } // end if

    // create new Employee object
    const employeeInfo = new Employee(data);
    // adding employee in db using mongoes employee Object
    const result = await employeeInfo.save();

    // set response with employee and JWT token
    res.status(200).json(
        Response.success({
            message: "Employee Assigned!",
            status: 200,
            data: result,
            accessToken: req.token,
        })
    );
});

// update specific employee
exports.updateEmployee = catchAsync(async (req, res) => {

    const employeeID = req.body.employee_id;
    const employee = await User.findById(employeeID);
    if (!employee) {
        // return with error of user not found in db
        return res.status(404).json(
            Response.notFound({ message: `Employee with this id could not be found.` })
        );
    } // end if

    const reportingToID = req.body.reporting_to_id;
    const reportingTo = await User.findById(reportingToID);
    if (!reportingTo) {
        // return with error of user not found in db
        return res.status(404).json(
            Response.notFound({ message: `Reporting to user with this id could not be found.` })
        );
    } // end if

    // create data for insertion
    const data = {
        name: (employee.first_name + " " + employee.middle_name + " " + employee.last_name).toLowerCase(),
        email: employee.email,
        position: req.body.position,
        _employee_id: employeeID,
        _reporting_to: reportingToID,
    }

    // validate request body using Joi Validation define in Employee Mongoes models
    const { error } = employeeUpdateValidate(data);
    if (error) {
        return res.status(422).json(
            Response.validation({ data: validateErrorFormatting(error) })
        );
    } // end if

    // find employee and update
    const employeeId = req.params.employeeId;
    const result = await Employee.findByIdAndUpdate(
        employeeId,
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
            message: 'Employee updated!',
            status: 200,
            data: result,
            accessToken: req.token,
        })
    );
});

exports.unassignEmployee = catchAsync(async (req, res) => {
    const result = await Employee.deleteOne(
        req.params.id,
    );
    res.status(200).json(
        Response.success({
            message: 'Employee Unassigned!',
            status: 200,
            data: result,
            accessToken: req.token,
        })
    );
});