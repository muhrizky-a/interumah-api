const { body, param } = require('express-validator');

const Design = require('../models/design');
const validator = require('.')
const NotFoundError = require('../exceptions/NotFoundError');

const validateBudgetPlanPayload = [
    param('id')
        .exists()
        .withMessage("ID Desain tidak ada.")
        // Custom query iuntuk mengecek apakah req.params.id ada di tabel Design.
        .custom(async (value) => {
            if (value) {
                const design = await Design.findOne({
                    where: {
                        id: value
                    }
                });

                if (!design) throw new NotFoundError('ID Desain tidak ditemukan.');
            }
        })
        .notEmpty().withMessage("ID Desain tidak boleh kosong.")
        .isInt().withMessage("ID Desain harus berupa angka."),
    body('*')
        .exists()
        .withMessage("Kategori RAB tidak ada.")
        .notEmpty().withMessage("Kategori RAB tidak boleh kosong."),
    body('*.data.*.uraian')
        .exists().withMessage("Uraian RAB tidak ada.")
        .notEmpty().withMessage("Uraian RAB tidak boleh kosong.")
        .isString().withMessage("Uraian RAB harus berupa string."),
    body('*.data.*.volume')
        .exists().withMessage("Volume tidak ada.")
        .notEmpty().withMessage("Volume tidak boleh kosong.")
        .isFloat().withMessage("Volume harus berupa angka desimal."),
    body('*.data.*.satuan')
        .exists().withMessage("Satuan tidak ada.")
        .notEmpty().withMessage("Satuan tidak boleh kosong.")
        .isString().withMessage("Satuan harus berupa string."),
    body('*.data.*.harga')
        .exists().withMessage("Harga tidak ada.")
        .notEmpty().withMessage("Harga tidak boleh kosong.")
        .isFloat().withMessage("Harga harus berupa angka desimal."),
    validator
];

module.exports = {
    validateBudgetPlanPayload
}