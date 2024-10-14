const { body, param, validationResult } = require('express-validator');

const Design = require('../models/design');
const validator = require('../validator')

const NotFoundError = require('../exceptions/NotFoundError');

const validateBookmarkPayload = [
    param('id')
        .exists()
        .withMessage("ID Desain tidak ada.")
        // Custom query iuntuk mengecek apakah req.params.id ada di tabel Design.
        .custom(
            async (value) => {
                if (value) {
                    const design = await Design.findOne({
                        where: {
                            id: value
                        }
                    });

                    if (!design) throw new NotFoundError('ID Desain tidak ditemukan.');
                }
            }
        )
        .notEmpty().withMessage("ID Desain tidak boleh kosong.")
        .isInt().withMessage("ID Desain harus berupa angka."),
    validator
];

module.exports = {
    validateBookmarkPayload
}