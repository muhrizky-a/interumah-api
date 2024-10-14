const configPassport = require("../config/config-passport")
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');

const User = require('../models/user');
const userService = require('../services/user');
const authService = require('../services/auth');

const InvariantError = require('../exceptions/InvariantError');
const AuthorizationError = require('../exceptions/AuthorizationError');
const NotFoundError = require("../exceptions/NotFoundError");
const AuthenticationError = require("../exceptions/AuthenticationError");


const authenticateLocal = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await userService.getUserByEmail(email,
            ['id', 'email', 'password', 'job', 'role', 'is_verified']
        );

        // Jika user tidak ada, kembalikan error
        if (!user) throw new NotFoundError("User tidak ditemukan");

        // Verifikasi password
        const fullPassword = `$argon2id$v=19$m=4096,t=3,p=${user.password}`;
        const isPasswordMatch = await argon2.verify(fullPassword, password);

        if (!isPasswordMatch) throw new AuthenticationError("Password salah");

        req.user = user;
        next();
    } catch (error) {
        next(error)
    }
}

const authenticateGoogle = configPassport.authenticate('google', { failureRedirect: '/login' });

const handleAuthGoogle = async (req, res, next) => {
    try {
        const { email } = req.user;

        const user = await userService.getUserByEmail(email,
            ['id', 'email']
        );

        // Jika user tidak ada, set state data user pada request bahwa user tidak ada.
        // Jika user ada, set id user ke req.user untuk di-passing ke middleware selanjutnya
        if (!user) {
            // Generate hashed password dari karakter random
            const hashPassword = await argon2.hash(
                require('crypto').randomBytes(16).toString('hex'),
                {
                    type: argon2.argon2id,
                    raw: false
                }
            );
            const splittedHashedPassword = hashPassword.split("p=")[1];

            const newUser = await User.create(
                {
                    name: `${req.user.name.givenName} ${req.user.name.familyName}`,
                    email: req.user.email,
                    password: splittedHashedPassword,
                }
            );

            req.user.id = newUser.id;
        } else {
            req.user.id = user.id;
        }

        next();
    } catch (error) {
        next(error)
    }
}

const verifyAccessToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        try {
            authHeader.split("Bearer ");
        } catch (err) {
            throw new InvariantError(
                "BAD_REQUEST",
                { auth: "Tidak ada kredensial yang dikirim." }
            );
        }

        const accessToken = authHeader.split("Bearer ")[1];

        // Verify JWT
        let decoded;
        try {
            decoded = authService.verifyJWT(accessToken, process.env.ACCESS_TOKEN_KEY);
            res.locals.decoded = decoded;

            req.user = decoded;
            req.user.userId = decoded.id;
        } catch (error) {
            throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
        }

        next();
    } catch (error) {
        next(error)
    }
}

const verifyRefreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        const auth = await authService.getAuth({ token: refreshToken });

        if (!auth) throw new InvariantError("Refresh Token Tidak Valid");

        // Verify JWT
        let decoded;
        try {
            decoded = authService.verifyJWT(refreshToken, process.env.REFRESH_TOKEN_KEY);
            res.locals.decoded = decoded;
        } catch (error) {
            console.log(error)
            throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
        }

        next();
    } catch (error) {
        next(error)
    }
}

const verifyUserAccess = (
    {
        accessIdentifier = 'id',
        accessRole
    }
) => {
    return async (req, res, next) => {
        try {
            // Check autorisasi
            if (accessRole) {
                if (!accessRole.includes(req.user.role)) throw new AuthorizationError("Anda tidak berhak mengakses resource ini.");
            }

            if (req.user.userId) {
                const user = await User.findOne({
                    attributes: ['id'],
                    where: {
                        id: req.user.userId
                    },
                });

                // Check autorisasi
                if (!user) throw new AuthorizationError("Anda tidak berhak mengakses resource ini.");
            }
            next();
        } catch (error) {
            next(error)
        }
    }
}

const verifyAdminAccess = (req, res, next) => {
    try {
        if (req.user.role == 'admin') {
            next();
        } else {
            throw new AuthorizationError("Anda tidak berhak mengakses resource ini.");
        }
    }
    catch (error) {
        next(error)
    }
};


module.exports = {
    authenticateLocal,
    authenticateGoogle,
    handleAuthGoogle,
    verifyAccessToken,
    verifyRefreshToken,
    verifyUserAccess,
    verifyAdminAccess
}