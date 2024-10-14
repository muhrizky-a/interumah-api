const { body, param, validationResult } = require('express-validator');
const lodash = require('lodash');

const InvariantError = require('../exceptions/InvariantError');


const throwValidationError = (errors) => {
    const newError = lodash(errors.errors)
        .groupBy('param')
        .mapValues(group => lodash.map(group, 'msg'))
        .value()

    throw new InvariantError(
        "BAD_REQUEST",
        newError
    )
}

// const validate = (payload) => [
//     ...payload,
//     (req, res, next) => {
//         const errors = validationResult(req);

//         if (!errors.isEmpty()) {
//             throwValidationError(errors);
//         }
//         next();
//     }
// ];

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throwValidationError(errors);
    }
    next();
}

module.exports = validate;