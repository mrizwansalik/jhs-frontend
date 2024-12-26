// third party import
const bcrypt = require('bcryptjs');
// import models
const { User, userValidate } = require('../../models/user');

// import utils (helper functions)
const catchAsync = require('../../utils/catchAsync');
const { validateErrorFormatting } = require('../../utils/helperFunction');
const { generatePassword } = require('../../utils/helperFunction');

const { Response } = require('../../../framework');
const newUserCreationEmail = require("../../utils/email/newUserCreationEmail");
// search user by email
exports.searchByEmail = catchAsync(async (req, res) => {
    const body = req.body;

    // find user from db
    const checkExistingUser = await User.findOne({ email: body.email });
    // if (!checkExistingUser) {
    //     return res.status(200).json(
    //         Response.error({ message: `User with this email not found` })
    //     );
    // }

    // set response with company and JWT token
    res.status(200).json(
        Response.success({
            message: "User information!",
            status: 200,
            data: checkExistingUser,
            accessToken: req.token,
        })
    );
});

// add new user from public
exports.addPublicUser = catchAsync(async (req, res) => {
    const body = {
        ...req.body,
        'role': "user",
    }
    // validate request body using Joi Validation define in User Mongoes models
    const { error } = userValidate(body);
    if (error) {
        return res.status(422).json(
            Response.validation({ data: validateErrorFormatting(error) })
        );
    } // end if

    // find user from db
    const checkExistingUser = await User.findOne({ email: body.email });
    if (checkExistingUser) {
        return res.status(400).json(
            Response.error({ message: `User Already exist with email ${body.email}` })
        );
    }

    if (typeof (body.username) == 'undefined') {
        body.username = "";
    } // set user name

    const generatedPassword = generatePassword(8);
    body.password = await bcrypt.hash(generatedPassword, 12);

    // create new User object
    const user = new User({
        ...body,
        full_name: (body.first_name ??  "" + " " + body.middle_name ?? "" + " " + body.last_name ??  "").trim()
    });
    // adding user in db using mongoes user Object
    const result = await user.save();

    // send email
    newUserCreationEmail({
        email: result.email,
        subject: 'Welcome to Journal of Healthcare Sciences',
        name: result.first_name,
        password: generatedPassword,
        websiteLink: "https://johs.com.sa/"
    });

    // set response with company and JWT token
    res.status(200).json(
        Response.success({
            message: "User created!",
            status: 200,
            data: result,
            accessToken: req.token,
        })
    );
});
