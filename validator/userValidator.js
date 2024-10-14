const { body } = require('express-validator');
const validator = require('.');

const InvariantError = require('../exceptions/InvariantError');

const name = body('name')
    .exists().withMessage("Nama tidak ada.")
    .notEmpty().withMessage("Nama tidak boleh kosong.")
    .isString().withMessage("Nama harus berupa string.");

const phone = body('phone')
    .exists().withMessage("Nomor Telepon tidak ada.")
    .notEmpty().withMessage("Nomor Telepon tidak boleh kosong.")
    .isString().withMessage("Nomor Telepon harus berupa string.")
    .isLength({ min: 11, max: 14 }).withMessage('Nomor Telepon harus diantara 11-14 karakter.');

const age = body('age')
    .exists().withMessage("Usia tidak ada.")
    .notEmpty().withMessage("Usia tidak boleh kosong.")
    .isInt().withMessage("Usia harus berupa string.");

const address = body('address')
    .exists().withMessage("Alamat tidak ada.")
    .notEmpty().withMessage("Alamat tidak boleh kosong.")
    .isString().withMessage("Alamat harus berupa string.");

const job = body('job')
    .exists().withMessage("Pekerjaan tidak ada.")
    .notEmpty().withMessage("Pekerjaan tidak boleh kosong.")
    .isString().withMessage("Pekerjaan harus berupa string.");

const email = body('email')
    .exists().withMessage("Email tidak ada.")
    .notEmpty().withMessage("Email tidak boleh kosong.")
    .isString().withMessage("Email harus berupa string.")
    .custom((email) => {
        // Validasi email memiliki format email
        const emailRegex = /^[\w\.]+@([\w-]+\.)+[\w]{2,4}$/;
        if (!emailRegex.test(email)) {
            throw new InvariantError("Format email salah.")
        }

        // Lanjut ke validasi berikutnya jika tanpa error
        return true;
    });

const password = body('password')
    .exists().withMessage("Password tidak ada.")
    .notEmpty().withMessage("Password tidak boleh kosong.")
    .isString().withMessage("Password harus berupa string.")
    .custom((password) => {
        // Validasi password mengandung huruf kecil
        const lowercase = /[a-z]/;
        if (!lowercase.test(password)) {
            throw new InvariantError("Password harus mengandung huruf kecil.")
        }

        // Lanjut ke validasi berikutnya jika tanpa error
        return true;
    })
    .custom((password) => {
        // Validasi password mengandung huruf kapital
        const uppercase = /[A-Z]/;
        if (!uppercase.test(password)) {
            throw new InvariantError("Password harus mengandung huruf kapital.")
        }

        return true;
    })
    .custom((password) => {
        // Validasi password mengandung angka
        const numeric = /[\d]/;
        if (!numeric.test(password)) {
            throw new InvariantError("Password harus mengandung angka.")
        }

        return true;
    })
    .custom((password) => {
        // Validasi password mengandung simbol
        const nonAlphanumeric = /[\W]/;
        if (!nonAlphanumeric.test(password)) {
            throw new InvariantError("Password harus mengandung simbol.")
        }

        return true;
    })
    .custom((password) => {
        // Validasi password minimal 8 karakter
        const minCharacter = /.{8,}/;
        if (!minCharacter.test(password)) {
            throw new InvariantError("Password harus memiliki minimal 8 karakter.")
        }

        return true;
    })
    .custom((password, { req }) => {
        // Validasi password sama dengan konfirmasi password
        if (password != req.body.confirmPassword) {
            throw new InvariantError("Konfirmasi Password tidak cocok.")
        }

        return true;
    });

const confirmPassword = body('confirmPassword')
    .exists().withMessage("Konfirmasi password tidak ada.")
    .notEmpty().withMessage("Konfirmasi password tidak boleh kosong.")
    .isString().withMessage("Konfirmasi password harus berupa string.");

const validateRegisterPayload = [
    email,
    confirmPassword,
    password,
    validator
];

const validateEmailPayload = [
    email,
    validator
];

const validatePasswordPayload = [
    confirmPassword,
    password,
    validator
];

const validateUserDataPayload = [
    name,
    phone,
    age,
    address,
    job,
    validator
];

module.exports = {
    validateRegisterPayload,
    validateUserDataPayload,
    validateEmailPayload,
    validatePasswordPayload
}