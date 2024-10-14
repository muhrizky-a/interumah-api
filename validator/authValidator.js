const { body } = require('express-validator');
const validator = require('.');

const validateAuthPayload = [
    body('refreshToken')
        .exists().withMessage("Refresh Token tidak ada.")
        .notEmpty().withMessage("Refresh Token tidak boleh kosong.")
        .isString().withMessage("Refresh Token harus berupa string."),
    validator
];

const validateLoginPayload = [
    body('email')
        .exists().withMessage("Email tidak ada.")
        .notEmpty().withMessage("Email tidak boleh kosong.")
        .isString().withMessage("Email harus berupa string."),
    body('password')
        .exists().withMessage("Password tidak ada.")
        .notEmpty().withMessage("Password tidak boleh kosong.")
        .isString().withMessage("Password harus berupa string."),
    validator
];


module.exports = {
    validateAuthPayload,
    validateLoginPayload
}