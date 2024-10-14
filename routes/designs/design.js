const router = require('express').Router();

const designValidator = require('../../validator/designValidator');
const authMiddleware = require('../../middleware/authMiddleware');
const designMiddleware = require('../../middleware/designs/designMiddleware');

const uploadMiddleware = require('../../middleware/uploadMiddleware');
const designController = require('../../controllers/designs/designController');

router.post('/designs',
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyUserAccess({ accessRole: ["designer"] }),
    uploadMiddleware.upload(uploadMiddleware.optionDesignUpload).array('image'),
    designValidator.validateDesignPayload,
    designController.createDesign
);

router.get('/designs',
    designController.getDesigns
);

router.get('/designs/:id',
    designController.getDesignById
);

router.put('/designs/:id',
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyUserAccess({ accessRole: ['designer', 'admin'] }),
    designMiddleware.verifyDesignAccess,
    designValidator.validateDesignPayload,
    designController.updateDesign
);

router.put('/designs/:id/image',
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyUserAccess({ accessRole: ['designer', 'admin'] }),
    designMiddleware.verifyDesignAccess,
    uploadMiddleware.upload(uploadMiddleware.optionDesignUpload).array('image'),
    designController.updateImage
);

router.delete('/designs/:id',
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyUserAccess({ accessRole: ['designer', 'admin'] }),
    designMiddleware.verifyDesignAccess,
    designController.deleteDesign
);

module.exports = router;