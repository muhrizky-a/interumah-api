const { body } = require('express-validator');
const User = require('../models/user');
const validator = require('.');

const validateChatPayload = [
    body('receiverId')
        .exists().withMessage("ID penerima tidak ada.")
        .notEmpty().withMessage("ID penerima tidak boleh kosong.")
        .isInt().withMessage("ID penerima harus berupa angka.")
        // Custom query iuntuk mengecek apakah id receiver terdaftar.
        .custom(
            async (id) => {
                const user = await User.findOne({
                    attributes: ['id'],
                    where: {
                        id
                    }
                });

                if (!user) throw new NotFoundError('ID penerima tidak terdaftar.');
            }
        ),
    body('contents')
        .exists().withMessage("Isi pesan tidak ada.")
        .notEmpty().withMessage("Isi pesan tidak boleh kosong.")
        .isString().withMessage("ID penerima harus berupa string."),
    validator
];

module.exports = {
    validateChatPayload
}