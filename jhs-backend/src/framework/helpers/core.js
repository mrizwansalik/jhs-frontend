const path = require('path');
const Joi = require('joi');

const callRepository = async (repository, method, args) => {
    const repositoryPath = path.resolve(process.cwd(), 'src/app/repositories/', repository);
    const Repository = require(repositoryPath);
    return await Repository[method](args);
};

const send = (res, data) => {
    return res
        .set({ 'Content-Type': 'application/json' })
        .status(200)
        .json({ ...data, data: data.data ?? {}, status: data.status ?? 200, message: data.message ?? 'Success' });
};

/**
 * Check if a records not exists in a database
 * @param {*} options
 * @returns
 */
const notExists = async (options = { field: null, value: null, model: null, formField: null }) => {
    let result = null;
    try {
        const model = path.resolve(process.cwd(), 'src/app/models/', options.model);
        const Model = require(model);
        var fieldName = options.field;
        result = await Model.find({ [fieldName]: options.value });
    } catch (error) {
        return error;
    } // end catch
    if (result?.length) {
        throw new Joi.ValidationError(
            'ValidationError',
            [
                {
                    message: `${fieldName} already exist`,
                    path: [options.formField ?? options.field],
                    context: {
                        key: options.formField ?? options.field,
                        label: options.model,
                        value: options.value,
                    },
                },
            ],
            options.value
        );
    } // end if
    return options.value;
};

/**
 * Check if a records exists in a database
 * @param {*} options
 * @returns
 */
const exists = async (options = { field: null, value: null, model: null, formField: null }) => {
    let result = null;
    try {
        const model = path.resolve(process.cwd(), 'src/app/models/', options.model);
        const Model = require(model);
        result = await Model.find({ [options.field]: options.value });
    } catch (error) {
        return error;
    } // end catch
    if (!result?.length) {
        throw new Joi.ValidationError(
            'ValidationError',
            [
                {
                    message: `${options.model} does not exists`,
                    path: [options.formField ?? options.field],
                    context: {
                        key: options.formField ?? options.field,
                        label: options.model,
                        value: options.value,
                    },
                },
            ],
            options.value
        );
    } // end if
    return options.value;
};

// export helper functions
module.exports = {
    callRepository,
    send,
    exists,
    notExists,
};
