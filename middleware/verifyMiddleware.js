const userVerificationService = require('../services/user_verification');
const InvariantError = require('../exceptions/InvariantError');
const AuthenticationError = require('../exceptions/AuthenticationError');

const generateRegisterToken = async (req, res, next) => {
    try {
        const user = req.user;
        const data = await userVerificationService.generateTokenOTP({ minutes: 60 });

        await userVerificationService.findOrCreateVerificationData(user.id);

        await userVerificationService.update(user.id, {
            register_token: data.token,
            register_expired_at: data.expirationTime,
            register_otp: (data.otp).toString()
        });

        req.mailContent = {
            subject: "Interumah | Verifikasi Akun.",
            htmlContent:
                `
            <p style="padding:8px 0;">Hai ${req.user.email}!</p>
            
            <p style="padding:8px 0;">Terima kasih telah melakukan registrasi di Interumah. Kami senang Anda bergabung.</p>
            
            <p style="padding:8px 0;">Klik tautan dibawah ini untuk mengkonfirmasi alamat email Anda:
            <a href="http://${req.headers.host}/users/register/verify?token=${data.token}" target="_blank">http://${req.headers.host}/users/register/verify?token=${data.token}</a>
            <br>Atau gunakan kode OTP berikut: <b>${data.otp}</p>

            <p style="padding:8px 0;">Tautan ini dapat digunakan dalam 1 jam ke depan.
            Anda dapat mengirim ulang tautan ini dengan membuka <a href="${req.headers.host}/users/verify" target="_blank">${req.headers.host}/users/verify</a></p>
            
            <p style="padding:8px 0;">Abaikan email ini jika anda tidak melakukan permintaan ini.</p>
            
            <p style="padding:8px 0;">Jika ada pertanyaan, hubungi <a href="mailto:support@interumah.id" target="_blank">support@interumah.id</a></p>
            
            <p style="padding:8px 0;">*Mohon pastikan email ini tidak berada di spam. Hal tersebut akan mempengaruhi link pada tombol konfirmasi</p>
            `
        };

        next();
    } catch (error) {
        next(error);
    }
}

const generateForgotPasswordToken = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await userVerificationService.getUserByEmail(email);
        const data = await userVerificationService.generateTokenOTP({ minutes: 10 });

        await userVerificationService.findOrCreateVerificationData(user.id);

        await userVerificationService.update(user.id, {
            password_token: data.token,
            password_expired_at: data.expirationTime,
            password_otp: (data.otp).toString()
        });

        req.user = user;
        req.mailContent = {
            subject: "Interumah | Lupa Password Akun.",
            htmlContent:
                `
            <p style="padding:8px 0;">Hai ${user.email}!</p>
            
            <p style="padding:8px 0;">Klik tautan dibawah ini untuk reset password anda:
            <a href="${process.env.FRONTEND_HOST}/users/forgot-password/verify?token=${data.token}" target="_blank">${process.env.FRONTEND_HOST}/users/forgot-password/verify?token=${data.token}</a>
            <br>Atau gunakan kode OTP berikut: <b>${data.otp}</p>

            <p style="padding:8px 0;">Tautan ini dapat digunakan dalam 15 menit ke depan.</p>
            <p style="padding:8px 0;">Abaikan email ini jika anda tidak melakukan permintaan ini.</p>
            
            <p style="padding:8px 0;">Jika ada pertanyaan, hubungi <a href="mailto:support@interumah.id" target="_blank">support@interumah.id</a></p>
            
            <p style="padding:8px 0;">*Mohon pastikan email ini tidak berada di spam. Hal tersebut akan mempengaruhi link pada tombol konfirmasi</p>
            `
        };

        next();
    } catch (error) {
        next(error);
    }
}

const handleGetVerifyRegister = async (req, res, next) => {
    try {
        const data = await userVerificationService.getVerificationDataFromToken(req, {
            condition: {
                register_token: req.body.token || req.query.token
            }
        });

        if (data.user.is_verified) return res.status(200).json({
            code: 200,
            message: 'User telah terverifikasi.'
        });

        if (new Date() > data.register_expired_at) throw new AuthenticationError("Token kadaluarsa.");

        req.userId = data.user.id;
        next()
    } catch (error) {
        next(error);
    }
}

const handleGetVerifyForgotPassword = async (req, res, next) => {
    try {
        const data = await userVerificationService.getVerificationDataFromToken(req, {
            condition: {
                password_token: req.body.token || req.query.token
            }
        });

        if (new Date() > data.password_expired_at) throw new AuthenticationError("Token kadaluarsa.");

        req.user = data.user;
        next();
    } catch (error) {
        next(error);
    }
}

const handlePostVerifyRegister = async (req, res, next) => {
    try {
        const { token, otp, email } = req.body;

        const data = await userVerificationService.getUserByEmail(email);

        if (data.is_verified) return res.status(200).json({
            code: 200,
            message: 'User telah terverifikasi.'
        });

        // Check token & otp
        if (!token && !otp) throw new InvariantError(
            "BAD_REQUEST",
            { token: "Tidak ada token / OTP yang dikirim." }
        );

        // Cek token kadaluarsa
        if (new Date() > data.user_verification.register_expired_at) throw new AuthenticationError("Token / OTP kadaluarsa.");

        // Check token
        if (token) {
            if (token != data.user_verification.register_token) throw new AuthenticationError("Token tidak valid.");
        }

        // Check OTP
        if (otp) {
            if (otp != data.user_verification.register_otp) throw new AuthenticationError("OTP tidak valid.");
        }

        req.userId = data.id;
        next()
    } catch (error) {
        next(error);
    }
}

const handlePostVerifyForgotPassword = async (req, res, next) => {
    try {
        const { token, otp, email } = req.body;

        const data = await userVerificationService.getUserByEmail(email);

        // Check token & otp
        if (!token && !otp) throw new InvariantError(
            "BAD_REQUEST",
            { token: "Tidak ada token / OTP yang dikirim." }
        );

        // Cek token kadaluarsa
        if (new Date() > data.user_verification.password_expired_at) throw new AuthenticationError("Token / OTP kadaluarsa.");

        // Check token
        if (token) {
            if (token != data.user_verification.password_token) throw new AuthenticationError("Token tidak valid.");
        }

        // Check OTP
        if (otp) {
            if (otp != data.user_verification.password_otp) throw new AuthenticationError("OTP tidak valid.");
        }

        // Simpan user id di req
        req.userId = data.id;
        req.user = data;
        req.user.userId = data.id;
        next()
    } catch (error) {
        next(error);
    }
}

module.exports = {
    generateRegisterToken,
    generateForgotPasswordToken,
    handleGetVerifyRegister,
    handleGetVerifyForgotPassword,
    handlePostVerifyRegister,
    handlePostVerifyForgotPassword,
}