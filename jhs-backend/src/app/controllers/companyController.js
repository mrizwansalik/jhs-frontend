// import models
const { Company, companyValidate } = require('../models/company');
const { User } = require('../models/user');

// import utils (helper functions)
const catchAsync = require('../utils/catchAsync');
const { Response } = require('../../framework');
const { validateErrorFormatting } = require('../utils/helperFunction');

// get all company
exports.getCompany = catchAsync(async (req, res) => {
    const company = await Company.findOne();
    res.status(200).json(
        Response.success({
            message: "succeed",
            status: 200,
            data: company,
        })
    );
});

// get specific company
exports.getCompanyWithOwner = catchAsync(async (req, res) => {
    const result = await Company.findOne().populate('_owner');
    if (!result) {
        // find company and update
        return res.status(404).json(
            Response.notFound({ message: `Company information not found.` })
        );
    }

    // set response with company and JWT token
    res.status(200).json(
        Response.success({
            message: "Company Information!",
            status: 200,
            data: result,
            accessToken: req.token,
        })
    );
});

// add new company
exports.updateCompany = catchAsync(async (req, res) => {
    const body = req.body;
    // validate request body using Joi Validation define in Company Mongoes models
    const { error } = companyValidate(body);
    if (error) {
        return res.status(422).json(
            Response.validation({ data: validateErrorFormatting(error) })
        );
    } // end if

    const userId = req.body._owner;
    const user = await User.findById(userId);
    if (!user) {
        // return with error of user not found in db
        return res.status(404).json(
            Response.notFound({ message: `User with this id could not be found.` })
        );
    } // end if

    let result = null;
    const company = await Company.findOne();

    if (company) {
        // find company and update
        const companyId = company._id;
        result = await Company.findByIdAndUpdate(
            companyId,
            req.body,
            {
                new: false,
                runValidators: true,
                returnOriginal: false,
            }
        );
    } else {
        // create new Company object
        const companyInfo = new Company(body);
        // adding company in db using mongoes company Object
        result = await companyInfo.save();
    } // end else

    // set response with company and JWT token
    res.status(200).json(
        Response.success({
            message: "Company Information is updated!",
            status: 200,
            data: result,
            accessToken: req.token,
        })
    );
});