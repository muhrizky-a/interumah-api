const router = require('express').Router();
const chatValidator = require('../validator/chatValidator');
const authMiddleware = require('../middleware/authMiddleware');
const chatController = require('../controllers/chatController');


router.post('/chats/',
    chatValidator.validateChatPayload,
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyUserAccess({}),
    // userMiddleware.checkVerifiedStatus,
    chatController.sendChat
);

router.get('/chats',
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyUserAccess({}),
    chatController.getChats
);

router.get('/chats/:chatPartnerId',
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyUserAccess({}),
    chatController.getChatsWithUser
);

module.exports = router;