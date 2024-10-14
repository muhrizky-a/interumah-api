const sequelize = require("sequelize");
const userService = require("../services/user");
const userVerificationService = require('../services/user_verification');
const InvariantError = require("../exceptions/InvariantError");
const NotFoundError = require("../exceptions/NotFoundError");

// CONTROLLERS
const handleCreateUser = async (req, res, next) => {
    try {
        const { email, password, role } = req.body;

        const hashedPassword = await userService.createHashedPassword(password);

        // tambahkan query find email
        await userService.createUser({
            email,
            password: hashedPassword,
            role
        });

        res.status(201).json(
            {
                code: 201,
                message: "User berhasil ditambahkan.",
                data: {
                    email
                }
            }
        );
    } catch (error) {
        next(error);
    }
}

const getUsers = async (req, res, next) => {
    try {
        const users = await userService.getUsers();

        res.json({
            code: 200,
            data: users.rows.map(user => {
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    imageUrl: `${req.headers.host}/uploads/users/profile/${user.image ?? 'default.png'}`,
                    isDesigner: user.role == 'designer',
                }
            })

        });
    } catch (error) {
        next(error);
    }
}

const getDesigners = async (req, res, next) => {
    try {
        const conditions = {
            role: "designer"
        };
        if (req.query.name) conditions.name = sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + req.query.name.toLowerCase() + '%');

        const users = await userService.getDesigners(conditions, true);

        res.json({
            code: 200,
            data: users.rows.map(user => userService.mapDBtoUserData(req, user))
        });
    } catch (error) {
        next(error);
    }
}

const getUserById = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) throw new NotFoundError("User tidak ditemukan.");

        res.json({
            code: 200,
            data: userService.mapDBtoUserData(req, user)
        });
    } catch (error) {
        next(error);
    }
}

const getUserProfile = async (req, res, next) => {
    try {
        const { userId } = req.user;

        const user = await userService.getUserById(userId);
        if (!user) throw new NotFoundError("User tidak ditemukan.");

        res.json({
            code: 200,
            data: userService.mapDBtoUserData(req, user)
        });
    } catch (error) {
        next(error);
    }
}

const handleUpdateUser = async (req, res, next) => {
    try {
        const { userId } = req.user;

        await userService.updateUser(userId, req.body);

        res.status(200).json({
            code: 200,
            message: "Data user berhasil diubah",
            data: req.body
        });
    } catch (error) {
        next(error);
    }
}

const updateEmail = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { email } = req.body;

        await userService.updateUser(userId, { email });

        res.status(200).json({
            code: 200,
            message: "Email berhasil diubah",
            data: {
                newEmail: email
            }
        });
    } catch (error) {
        next(error);
    }
}

const updatePassword = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { password } = req.body;

        const hashedPassword = await userService.createHashedPassword(password);

        await userService.updateUser(userId, { password: hashedPassword });

        // Reset token verifikasi
        await userVerificationService.update(userId, { password_expired_at: new Date() });

        res.status(200).json({
            code: 200,
            message: "Password berhasil diubah"
        });
    } catch (error) {
        next(error);
    }
}

const updateImage = async (req, res, next) => {
    try {
        const { userId } = req.user;

        // Cek apakah foto profil diupload
        if (!req.files[0]) throw new InvariantError(
            "BAD_REQUEST",
            {
                image: [
                    "Foto profil tidak diupload"
                ]
            }
        );

        const { filename } = req.files[0];
        await userService.updateUser(userId, { image: filename });

        res.status(200).json({
            code: 200,
            message: "Foto profil berhasil diubah"
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    handleCreateUser,
    handleUpdateUser,
    getUsers,
    getDesigners,
    getUserById,
    getUserProfile,
    updateEmail,
    updatePassword,
    updateImage
};