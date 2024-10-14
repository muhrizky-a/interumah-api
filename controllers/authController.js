const authService = require('../services/auth');

const createAuth = async (req, res, next) => {
    try {
        const user = req.user;

        const accessToken = authService.generateAccessToken(user);
        const refreshToken = authService.generateRefreshToken(user);

        const auth = await authService.getAuth({ user_id: user.id });

        // Add token if auth row not exists, or update token if auth row not exists
        if (!auth) {
            await authService.createAuth({
                user_id: user.id,
                token: refreshToken
            });
        } else {
            await authService.updateAuth(user.id, { token: refreshToken });
        }

        res.status(201).json({
            code: 201,
            data: {
                accessToken,
                refreshToken
            }
        });
    } catch (error) {
        next(error);
    }
}

const updateAuth = async (req, res, next) => {
    try {
        const decoded = res.locals.decoded;

        const accessToken = authService.generateAccessToken(decoded);
        res.status(200).json({
            code: 200,
            data: {
                accessToken,
            }
        });
    } catch (error) {
        next(error)
    }
}

const deleteAuth = async (req, res, next) => {
    try {
        const user = res.locals.decoded;

        // Delete token from database
        await authService.deleteAuth(user.id);

        res.status(200).json({
            code: 200,
            message: 'Refresh token berhasil dihapus',
        });
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createAuth,
    updateAuth,
    deleteAuth
};