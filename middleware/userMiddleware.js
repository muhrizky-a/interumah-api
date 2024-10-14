const userService = require('../services/user');
const userVerificationService = require('../services/user_verification');
const InvariantError = require('../exceptions/InvariantError');

const verifyNewEmail = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await userService.getUserByEmail(email);

        if (user) throw new InvariantError(
            "BAD_REQUEST",
            { email: "Email sudah digunakan." }
        );

        next();
    } catch (error) {
        next(error)
    }
}

const checkVerifiedStatus = async (req, res, next) => {
    try {
        const { userId } = req.user;
        await userVerificationService.checkUserVerifiedStatus(userId);

        next();
    } catch (error) {
        next(error)
    }
}

const sanitizeUserData = async (req, res, next) => {
    try {
        // Add req.body key whitelists
        // Tambahkan key whitelists untuk req.body 
        const whitelist = ["name", "phone", "age", "address", "job"]

        // Remove unnecessary key in req.body
        // Hapus key yang tidak diperlukan dari req.body
        for (let key in req.body) {
            if (!whitelist.includes(key)) {
                delete req.body[key]
            }
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    verifyNewEmail,
    checkVerifiedStatus,
    sanitizeUserData
}