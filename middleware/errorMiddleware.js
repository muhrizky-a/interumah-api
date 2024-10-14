module.exports = function (err, req, res, next) {
    if (err) {
        // Set status code error
        err.statusCode = err.statusCode ?? 500;

        // Set error dari err.errors
        let errors = (typeof val === 'string') ? JSON.parse(err.errors) : err.errors;

        res.status(err.statusCode).json(
            {
                code: err.statusCode,
                message: err.message,
                errors
            }
        )
    }
}