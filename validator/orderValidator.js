const { body, param } = require('express-validator');

const Design = require('../models/design');
const Order = require('../models/orders');
const validator = require('.')

const NotFoundError = require('../exceptions/NotFoundError');

const orderId = param('id')
    .exists()
    .withMessage("ID Pemesanan tidak ada.")
    // Custom query iuntuk mengecek apakah pemesanan ada di tabel Order.
    .custom(
        async (value) => {
            if (value) {
                const order = await Order.findOne({
                    where: {
                        id: value
                    }
                });

                if (!order) throw new NotFoundError('ID Pemesanan tidak ditemukan.');
            }
        }
    )
    .notEmpty().withMessage("ID Pemesanan tidak boleh kosong.")
    .isInt().withMessage("ID Pemesanan harus berupa angka.");

const validateNewOrderPayload = [
    body('designId')
        .exists()
        .withMessage("ID Desain tidak ada.")
        // Custom query iuntuk mengecek apakah req.body.design_id ada di tabel Design.
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

const validateOrderId = [
    orderId,
    validator
];

const validateOrderPayload = [
    orderId,
    body('status')
        .exists().withMessage("Status pesanan tidak ada.")
        .notEmpty().withMessage("Status pesanan tidak boleh kosong.")
        .isString().withMessage("Status pesanan harus berupa string."),
    body('price')
        .exists().withMessage("Harga tidak ada.")
        .notEmpty().withMessage("Harga tidak boleh kosong.")
        .isInt().withMessage("Harga harus berupa angka desimal.")
        .isInt({ min: 1 }).withMessage("Harga harus diatas Rp. 0."),
    validator
];

module.exports = {
    validateNewOrderPayload,
    validateOrderId,
    validateOrderPayload
}