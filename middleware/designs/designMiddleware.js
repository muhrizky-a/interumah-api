const designService = require('../../services/design');

const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

const verifyDesignAccess = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const design = await designService.getDesignById(req.params.id, true);

        if (!design) throw new NotFoundError('Desain Interior tidak ditemukan.');
        if (design.user_id != userId) throw new AuthorizationError("Anda tidak berhak mengakses resource ini");

        next();
    } catch (error) {
        next(error)
    }
}

const verifyDesignExistsByParams = async (req, res, next) => {
    try {
        const design = await designService.getDesignById(req.params.id);
        if (!design) throw new NotFoundError("Design Interior tidak ada.");

        next();
    } catch (error) {
        next(error)
    }
};

module.exports = {
    verifyDesignExistsByParams,
    verifyDesignAccess,
}