const router = require('express').Router();

const reviewValidator = require('../../validator/reviewValidator');

const authMiddleware = require('../../middleware/authMiddleware');
const designMiddleware = require('../../middleware/designs/designMiddleware');

const reviewController = require('../../controllers/designs/reviewController');

router.post('/designs/:designId/reviews',
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyUserAccess({ accessRole: ["user"] }),
    reviewValidator.validateReviewPayload,
    reviewController.createReview
);

router.get('/designs/:id/reviews',
    designMiddleware.verifyDesignExistsByParams,
    reviewController.getReviews
);

router.get('/designs/:designId/reviews/:reviewId',
    reviewController.getReviewById
);

router.get('/reviews',
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyUserAccess({ accessRole: ["user"] }),
    reviewController.getReviewsCreated
);

module.exports = router;