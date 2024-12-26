// import models
const { Journal, journalUpdateValidate, journalValidate } = require('../models/journal');
const { User } = require('../models/user');

// import utils (helper functions)
const catchAsync = require('../utils/catchAsync');
const { validateErrorFormatting } = require('../utils/helperFunction');
const { Response } = require('../../framework');
const factory = require('./handleFactory');


// get all journal
exports.getJournal = catchAsync(async (req, res) => {
    const journal = await Journal.findOne();
    res.status(200).json(
        Response.success({
            message: "succeed",
            status: 200,
            data: journal,
        })
    );
});

// get specific journal
exports.getJournalWithManager = catchAsync(async (req, res) => {
    const result = await Journal.findOne().populate('_manageBy');
    if (!result) {
        // find journal and update
        return res.status(404).json(
            Response.notFound({ message: `Journal information not found.` })
        );
    }

    // set response with journal and JWT token
    res.status(200).json(
        Response.success({
            message: "Journal Information!",
            status: 200,
            data: result,
            accessToken: req.token,
        })
    );
});

// add new journal
exports.updateJournal = catchAsync(async (req, res) => {
    const body = req.body;
    // validate request body using Joi Validation define in Journal Mongoes models
    const { error } = journalValidate(body);
    if (error) {
        return res.status(422).json(
            Response.validation({ data: validateErrorFormatting(error) })
        );
    } // end if

    const userId = req.body._manageBy;
    const user = await User.findById(userId);
    if (!user) {
        // return with error of user not found in db
        return res.status(404).json(
            Response.notFound({ message: `User with this id could not be found.` })
        );
    } // end if

    let result = null;
    const journal = await Journal.findOne();

    if (journal) {
        // find journal and update
        const journalId = journal._id;
        result = await Journal.findByIdAndUpdate(
            journalId,
            req.body,
            {
                new: false,
                runValidators: true,
                returnOriginal: false
            }
        );
    } else {
        // create new Journal object
        const journalInfo = new Journal(body);
        // adding journal in db using mongoes journal Object
        result = await journalInfo.save();
    } // end else

    // set response with journal and JWT token
    res.status(200).json(
        Response.success({
            message: "Journal Information is updated!",
            status: 200,
            data: result,
            accessToken: req.token,
        })
    );
});