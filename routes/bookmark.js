const router = require('express').Router();

const authMiddleware = require('../middleware/authMiddleware');
const bookmarkValidator = require('../validator/bookmarkValidator');
const bookmarkController = require('../controllers/bookmarkController');

router.post('/designs/:id/bookmarks',
    bookmarkValidator.validateBookmarkPayload,
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyUserAccess({ accessRole: ["user"] }),
    bookmarkController.handleAddOrDelete
);

router.get('/bookmarks',
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyUserAccess({ accessRole: ["user"] }),
    bookmarkController.getBookmarks
);

module.exports = router;