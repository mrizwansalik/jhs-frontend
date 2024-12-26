// import utils (helper functions)
const catchAsync = require('../utils/catchAsync');
const { Response } = require('../../framework');
const APIFeatures = require('../utils/apiFeatures');

// delete one
const deleteOne = (Model) =>
    catchAsync(async (req, res) => {
        const doc = await Model.findByIdAndDelete(req.params.id);
        if (!doc) {
            return res.status(404).json(
                Response.notFound({ message: `No document found with that ID` })
            );
        }
        res.status(204).json(
            Response.success({ 
                message: 'doc deleted successfully',
                status: 204,
                data: null,
                accessToken: req.token,
            })
        );
    });

// update one
const updateOne = (Model) =>
    catchAsync(async (req, res) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!doc) return res.status(404).json(
            Response.notFound({ message: `No document found with that ID` })
        );
        const result = await res.json(
            Response.success({ 
                message: 'Document updated successfully',
                status: 200,
                data: doc,
                accessToken: req.token,
            })
        );
    });

// delete one
const createOne = (Model) =>
    catchAsync(async (req, res) => {
        const newTour = await Model.create(req.body);
        res.json(
            Response.success({ 
                message: 'Document created successfully',
                status: 200,
                data: newTour,
                accessToken: req.token,
            })
        );
    });

// get one
const getOne = (Model, populateOptions) =>
    catchAsync(async (req, res) => {
        let query = Model.findById(req.params.id);
        if (populateOptions) {
            query = query.populate(populateOptions);
        }
        const doc = await query;
        // const doc = await Model.findById(req.params.id).populate('reviews');
        if (!doc) return res.status(404).json(
            Response.notFound({ message: `No document found with that ID` })
        );
        res.status(200).json(
            Response.success({ 
                message: 'Document found',
                status: 200,
                data: doc,
                accessToken: req.token,
            })
        );
    });

const getByFiled = (Model, getBy, populateOptions) =>
    catchAsync(async (req, res) => {
        let query = Model.findOne({[getBy]: req.params.id});
        if (populateOptions) query = query.populate(populateOptions);
        const doc = await query;
        // const doc = await Model.findById(req.params.id).populate('reviews');
        if (!doc) return res.status(404).json(
            Response.notFound({ message: `No document found with that ID` })
        );
        res.status(200).json(
            Response.success({ 
                message: 'Success',
                status: 200,
                data: doc,
                accessToken: req.token,
            })
        );
    });

// get all
const getAll = (Model, populateOptions) =>
    catchAsync(async (req, res) => {
        //To Allow nested  GET reviews rotes
        let filter = {};
        if (req.params.tourId) filter.tourId = {tour: req.params.tourId};
        let query = Model.find();
        if (populateOptions) query = query.populate(populateOptions);
        const features = new APIFeatures(query, req.query)
            .filter()
            .sorting()
            .limitFields()
            .pagination();
        const doc = await features.query;
        // const query = Tour.find(); 
        // const allDoc = await query;
        res.status(200).json(
            Response.success({ 
                message: 'Success',
                status: 200,
                data: doc,
                pagination:features.query.paginated,
                accessToken: req.token,
            })
        );
    });

// export all function
module.exports = {deleteOne, updateOne, createOne, getOne, getByFiled, getAll};