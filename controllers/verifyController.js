const userService = require('../services/user');
const userVerificationService = require('../services/user_verification');

const updateUserVerifiedStatus = async (req, res, next) => {
    try {
        const userId = req.userId;

        // Update status user verified
        await userService.updateUser(userId, { is_verified: true });

        // Reset token verifikasi
        await userVerificationService.update(userId, { register_expired_at: new Date() });

        res.status(200).json({
            code: 200,
            message: 'User berhasil terverifikasi.',
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    updateUserVerifiedStatus
};