const multer = require('multer');
const path = require('path');
const InvariantError = require('../exceptions/InvariantError');
// const FileUpload = require('express-fileupload');

const imageUploadWhitelist = [
    "image/png",
    "image/jpg",
    "image/jpeg",
];

const upload = (options) => multer(options);

const optionUserImageUpload = {
    storage: multer.diskStorage({
        destination: 'uploads/users/profile',
        filename: function (req, file, cb) {
            const fileFormat = file.mimetype.split('image/')[1];
            cb(null, 'profile-' + (+new Date()) + '.' + fileFormat);
        },
    }),
    fileFilter: (req, file, cb) => {
        if (imageUploadWhitelist.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    },
    limits: {
        fileSize: 10485760 // 1 MB
    }
}

const optionDesignUpload = {
    storage: multer.diskStorage({
        destination: 'uploads/designs/',
        filename: function (req, file, cb) {
            const fileFormat = file.mimetype.split('image/')[1];
            cb(null, 'design-' + (+new Date()) + '.' + fileFormat);
        },
    }),
    fileFilter: (req, file, cb) => {
        if (imageUploadWhitelist.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new InvariantError('Hanya mendukung format .png, .jpg and .jpeg!'));
        }
    },
    limits: {
        fileSize: 10485760 // 1 MB
    }
}

const optionOrderReceiptUpload = {
    storage: multer.diskStorage({
        destination: 'uploads/designs/receipts',
        filename: function (req, file, cb) {
            const fileFormat = file.mimetype.split('image/')[1];
            cb(null, 'receipt-' + (+new Date()) + '.' + fileFormat);
        },
    }),
    fileFilter: (req, file, cb) => {
        if (imageUploadWhitelist.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new InvariantError('Hanya mendukung format .png, .jpg and .jpeg!'));
        }
    },
    limits: {
        fileSize: 10485760 // 1 MB
    }
}

// Experimental feature to upload file
const uploadFile = async (req, res) => {
    try {
        let file = req.files.task_file

        if (file != null) {
            const ext = path.extname(file.name);
            let task_file = file.md5 + ext;

            await file.mv(`./uploads/${task_file}`)
            console.log(task_file);
            res.status(201).json({ msg: "File Terupload" })
        } else {
            res.status(500).json({ msg: "File Gagal Terupload" })
        }
    } catch (error) {
        res.status(422).json({ error })
    }
}

module.exports = {
    upload,
    imageUploadWhitelist,
    optionUserImageUpload,
    optionDesignUpload,
    optionOrderReceiptUpload,
    // uploadFile
}