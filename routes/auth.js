const router = require('express').Router();
const authValidator = require('../validator/authValidator');
const authMiddleware = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');

router.post('/auth',
    authValidator.validateLoginPayload,
    authMiddleware.authenticateLocal,
    authController.createAuth
);

router.get('/oauth2/redirect/google',
    authMiddleware.authenticateGoogle,
    authMiddleware.handleAuthGoogle,
    authController.createAuth
);

router.put('/auth',
    authValidator.validateAuthPayload,
    authMiddleware.verifyRefreshToken,
    authController.updateAuth
);
router.delete('/auth',
    authValidator.validateAuthPayload,
    authMiddleware.verifyRefreshToken,
    authController.deleteAuth
);

module.exports = router;