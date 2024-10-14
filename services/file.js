const fs = require('fs');
const path = require('path');
const NotFoundError = require('../exceptions/NotFoundError');

const getFile = (dir) => {
    const file = path.resolve(dir);
    if (!fs.existsSync(dir)) throw new NotFoundError("File tidak ditemukan.");
    return file;
}

module.exports = {
    getFile
};