const defaultPageSize = 10;

const paginate = (size, page, options) => {
    if (size) {
        size = isNaN(parseInt(size)) ? defaultPageSize : parseInt(size);
        options.limit = size;
    }
    if (page) {
        page = isNaN(parseInt(page)) ? 0 : parseInt(page);
        page = (page - 1) >= 0 ? (page - 1) : 0;
        options.offset = page * (size ?? defaultPageSize);
    }
}

module.exports = {
    paginate
};