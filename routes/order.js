const router = require('express').Router();

const orderValidator = require('../validator/orderValidator');

const userMiddleware = require('../middleware/userMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');
const orderMiddleware = require('../middleware/orderMiddleware');

const orderController = require('../controllers/orderController');


router.post('/orders/',
    orderValidator.validateNewOrderPayload,
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyUserAccess({ accessRole: ['user'] }),
    // userMiddleware.checkVerifiedStatus, // user harus telah terverifikasi sebalum dapat membuat order
    orderController.createNewOrder
);


router.post('/orders/:id/receipts',
    orderValidator.validateOrderId,
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyUserAccess({ accessRole: ['user'] }),
    // userMiddleware.checkVerifiedStatus, // user harus telah terverifikasi sebalum dapat membuat order
    orderMiddleware.checkRequestedOrderAccess,
    uploadMiddleware.upload(uploadMiddleware.optionOrderReceiptUpload).array('image'),
    orderController.createOrderReceipt
);

router.get('/orders',
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyUserAccess({ accessRole: ['user'] }),
    orderController.getOrderHistory
);

router.get('/orders/managed',
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyUserAccess({ accessRole: ['designer', 'admin'] }),
    orderController.getManagedOrders
);

router.get('/orders/:id',
    orderValidator.validateOrderId,
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyUserAccess({ accessRole: ['user'] }),
    orderMiddleware.checkRequestedOrderAccess,
    orderController.getOrderReceiptsHistory
);

router.get('/orders/:id/receipts',
    orderValidator.validateOrderId,
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyUserAccess({ accessRole: ['user'] }),
    orderMiddleware.checkRequestedOrderAccess,
    orderController.getOrderReceiptsHistory
);

router.get('/orders/managed/:id',
    orderValidator.validateOrderId,
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyUserAccess({ accessRole: ['designer', 'admin'] }),
    orderMiddleware.checkManagedOrderAccess,
    orderController.getManagedOrderReceipts
);

router.get('/orders/managed/:id/receipts',
    orderValidator.validateOrderId,
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyUserAccess({ accessRole: ['designer', 'admin'] }),
    orderMiddleware.checkManagedOrderAccess,
    orderController.getManagedOrderReceipts
);

router.put('/orders/:id',
    orderValidator.validateOrderPayload,
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyUserAccess({ accessRole: ['designer', 'admin'] }),
    orderMiddleware.checkManagedOrderAccess,
    orderController.updateOrder
);

module.exports = router;