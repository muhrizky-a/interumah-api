const { body } = require('express-validator');

const Category = require('../models/category');

const validator = require('.')

const NotFoundError = require('../exceptions/NotFoundError');

const validateDesignPayload = [
    body('category_id')
        .exists()
        .withMessage("ID kategori tidak ada.")
        // Custom query iuntuk mengecek apakah req.category_id ada di tabel Category.
        .custom(
            async (value) => {
                if (value) {
                    const category = await Category.findOne({
                        where: {
                            id: value
                        }
                    });

                    if (!category) throw new NotFoundError('ID kategori tidak ditemukan.');
                }
            }
        )
        .notEmpty().withMessage("ID kategori tidak boleh kosong.")
        .isInt().withMessage("ID kategori harus berupa angka."),
    body('title')
        .exists().withMessage("Judul tidak ada.")
        .notEmpty().withMessage("Judul tidak boleh kosong.")
        .isString().withMessage("Judul harus berupa string."),
    body('description')
        .exists().withMessage("Deskripsi tidak ada.")
        .notEmpty().withMessage("Deskripsi tidak boleh kosong.")
        .isString().withMessage("Deskripsi harus berupa string."),
    body('price')
        .exists().withMessage("Harga tidak ada.")
        .notEmpty().withMessage("Harga tidak boleh kosong.")
        .isInt().withMessage("Harga harus berupa angka desimal.")
        .isInt({ min: 1 }).withMessage("Harga harus diatas Rp. 0."),
    validator
];

module.exports = {
    validateDesignPayload
}