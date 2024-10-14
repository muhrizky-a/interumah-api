const router = require('express').Router();

const userValidator = require('../validator/userValidator');
const userMiddleware = require('../middleware/userMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const verifyMiddleware = require('../middleware/verifyMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');
const emailMiddleware = require('../middleware/emailMiddleware');
const userController = require('../controllers/userController');
const verifyController = require('../controllers/verifyController');

router.post('/users/register',
    userValidator.validateRegisterPayload,
    userMiddleware.verifyNewEmail,
    userController.handleCreateUser
);

router.get('/users', userController.getUsers);
router.get('/users/designers', userController.getDesigners);
router.get('/users/:id', userController.getUserById);
router.get('/profile',
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyUserAccess({}),
    userController.getUserProfile
);

router.put('/users',
    userValidator.validateUserDataPayload,
    userMiddleware.sanitizeUserData,
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyUserAccess({}),
    userController.handleUpdateUser
);

router.put('/users/email',
    userValidator.validateEmailPayload,
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyUserAccess({}),
    userController.updateEmail
);

router.put('/users/password',
    userValidator.validatePasswordPayload,
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyUserAccess({}),
    userController.updatePassword
);

router.put('/users/image',
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyUserAccess({}),
    uploadMiddleware.upload(uploadMiddleware.optionUserImageUpload).array('image'),
    userController.updateImage
);

router.post('/users/verify',
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyUserAccess({}),
    verifyMiddleware.generateRegisterToken,
    emailMiddleware.sendEmail,
    async (req, res) => res.status(201).json({
        code: 201,
        status: "Email Verifikasi telah dikirim."
    })
);

router.get('/users/register/verify',
    verifyMiddleware.handleGetVerifyRegister,
    verifyController.updateUserVerifiedStatus
);
router.post('/users/register/verify',
    verifyMiddleware.handlePostVerifyRegister,
    verifyController.updateUserVerifiedStatus
);

router.post('/users/forgot-password',
    userValidator.validateEmailPayload,
    verifyMiddleware.generateForgotPasswordToken,
    emailMiddleware.sendEmail,
    async (req, res) => res.status(201).json({
        code: 201,
        status: "Email Lupa Password telah dikirim."
    })
);

router.get('/users/forgot-password/verify',
    verifyMiddleware.handleGetVerifyForgotPassword,
    async (req, res) => res.status(200).json({
        code: 200,
        message: `Silahkan ubah password di halaman "Ganti password".`,
        data: {
            email: req.user.email
        }
    })
);

router.post('/users/forgot-password/verify',
    userValidator.validateEmailPayload,
    userValidator.validatePasswordPayload,
    verifyMiddleware.handlePostVerifyForgotPassword,
    userController.updatePassword
);

module.exports = router;