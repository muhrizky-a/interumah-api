const router = require('express').Router();
const path = require('path');
const fs = require('fs')

const NotFoundError = require('../exceptions/NotFoundError');

router.post('/uploads', async (req, res) => {
    try {
        const { type } = req.query;
        let file;
        let url;
        let destination;

        if (type == 'file-comment') {
            file = req.files.task_file;
            url = `${req.headers.host}/uploads/tasks/`
            destination = "./uploads/tasks/";
        } else if (type == 'profile') {
            file = req.files.profile_img;
            url = `${req.headers.host}/uploads/users/`
            destination = "./uploads/users/";
        }

        if (file != null) {
            const ext = path.extname(file.name);
            let fileName = +new Date() + ext;

            await file.mv(`${destination}${fileName}`)

            res.json({
                fileName,
                url: url + fileName,
            })
        } else {
            res.status(500).json({ msg: "File Tidak ada" })
        }
    } catch (error) {
        res.status(422).json({ error })
    }
});

router.get('/uploads/:dir/:file',
    (req, res, next) => {
        try {
            const dir = path.resolve('uploads', req.params.dir, req.params.file);

            if (!fs.existsSync(dir)) {
                throw new NotFoundError("FILE_NOT_FOUND");
            }

            res.sendFile(dir);
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;