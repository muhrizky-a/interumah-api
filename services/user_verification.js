const User = require('../models/user');
const Verify = require("../models/user_verification");
const AuthorizationError = require('../exceptions/AuthorizationError');
const InvariantError = require('../exceptions/InvariantError');
const AuthenticationError = require('../exceptions/AuthenticationError');
const NotFoundError = require('../exceptions/NotFoundError');

const generateTokenOTP = ({ minutes }) => {
    const token = require('crypto').randomBytes(16).toString('hex');

    const expirationTime = new Date();
    const aMinuteToMiliseconds = 60000; //60000 miliseconds or 60 seconds
    const modifiedTime = expirationTime.getTime() + minutes * aMinuteToMiliseconds;
    expirationTime.setTime(modifiedTime);

    // Generate OTP dari 100000 - 1099999 ( 6 hingga 7 digit)
    const otpMinOffset = 100000 // 6 digit starts from 100000
    const otpMaxOffset = 1000000 // 7 digit starts from 1000000
    let otp = Math.floor(Math.random() * otpMaxOffset) + otpMinOffset;

    // If OTP value is more than 6 digit, subtract with 100000 so it will stay 6 digit. Otherwise, keep the OTP digit value.
    otp = (otp >= otpMaxOffset) ? otp -= otpMinOffset : otp;

    return { token, otp, expirationTime };
}

const findOrCreateVerificationData = async (userId) => {
    const verification = await Verify.findOne({
        where: {
            user_id: userId,
        }
    })

    if (!verification) await Verify.create({
        user_id: userId
    });
}

const getVerificationDataFromToken = async (req, { condition }) => {
    const tokenFromQuery = req.query.token;
    const tokenFromBody = req.body.token;

    if (!tokenFromBody && !tokenFromQuery) throw new InvariantError(
        "BAD_REQUEST",
        { token: "Tidak ada token yang dikirim." }
    );


    const data = await Verify.findOne({
        where: condition,
        include: {
            model: User,
            attributes: ['id', 'email', 'is_verified']
        }
    });

    if (!data) throw new AuthenticationError("Token tidak valid.");
    return data;
}

const getUserByEmail = async (email) => {
    const data = await User.findOne({
        attributes: ['id', 'email', 'is_verified'],
        where: { email },
        include: {
            model: Verify
        }
    });

    if (!data) throw new NotFoundError("Email tidak ditemukan.");
    return data;
}

const checkUserVerifiedStatus = async (id) => {
    const user = await User.findOne({
        attributes: ['email', 'is_verified'],
        where: { id },
    });

    if (!user.is_verified) throw new AuthorizationError("Silahkan verifikasi akun terlebih dahulu.");
}

const update = async (userId, payload) => {
    const data = await Verify.update(payload, {
        where: { user_id: userId }
    });

    return {
        id: data.id
    };
}

module.exports = {
    generateTokenOTP,
    findOrCreateVerificationData,
    getVerificationDataFromToken,
    getUserByEmail,
    checkUserVerifiedStatus,
    update
};