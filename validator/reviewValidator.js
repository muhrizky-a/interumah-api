const { body, param } = require('express-validator');
const Design = require('../models/design');
const validator = require('.')
const NotFoundError = require('../exceptions/NotFoundError');

const designId = param('designId')
    .exists()
    .withMessage("ID Desain tidak ada.")
    // Custom query iuntuk mengecek apakah req.params.designId terdapat di tabel Design.
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
    .isInt().withMessage("ID Desain harus berupa angka.");

const validateReviewPayload = [
    designId,
    body('designRating')
        .exists().withMessage("Rating Desain Interior tidak ada.")
        .notEmpty().withMessage("Rating Desain Interior tidak boleh kosong.")
        .isInt().withMessage("Rating Desain Interior harus berupa angka")
        .isInt({ min: 1, max: 5 }).withMessage("Rating Desain Interior harus berkisar antara 1 hingga 5."),
    body('designerRating')
        .exists().withMessage("Rating Desainer tidak ada.")
        .notEmpty().withMessage("Rating Desainer tidak boleh kosong.")
        .isInt().withMessage("Rating Desainer harus berupa angka")
        .isInt({ min: 1, max: 5 }).withMessage("Rating Desainer harus berkisar antara 1 hingga 5."),
    body('designComments')
        .exists().withMessage("Komentar Desain tidak ada.")
        .notEmpty().withMessage("Komentar Desain tidak boleh kosong.")
        .isString().withMessage("Komentar Desain harus berupa string"),
    body('designerComments')
        .exists().withMessage("Komentar Desainer tidak ada.")
        .notEmpty().withMessage("Komentar Desainer tidak boleh kosong.")
        .isString().withMessage("Komentar Desainer harus berupa string"),
    validator
];

module.exports = {
    validateReviewPayload
}