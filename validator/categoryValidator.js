const { body } = require('express-validator');
const validator = require('.')

const validateCategoryPayload = [
    body('name')
        .exists().withMessage("Nama kategori tidak ada.")
        .notEmpty().withMessage("Nama kategori tidak boleh kosong.")
        .isString().withMessage("Nama kategori harus berupa string."),
    validator
];

module.exports = {
    validateCategoryPayload
}