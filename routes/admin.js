const router = require('express').Router();

const authMiddleware = require('../middleware/authMiddleware');
const adminController = require('../controllers/admin');

// Admin auth
router.post('/admin/auth/generate-secret',
    adminController.handleGenerateSecret
);
router.post('/admin/auth',
    adminController.handleAuth
);

router.get('/admin/data',
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyAdminAccess,
    adminController.getData
);

router.get('/admin/data/designers',
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyAdminAccess,
    adminController.getDesigners
);

router.get('/admin/data/designs',
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyAdminAccess,
    adminController.getDesigns
);

router.get('/admin/data/orders',
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyAdminAccess,
    adminController.getOrders
);

router.get('/admin/data/receipts',
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyAdminAccess,
    adminController.getReceipts
);

module.exports = router;