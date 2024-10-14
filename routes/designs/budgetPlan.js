const router = require('express').Router();

const budgetPlanValidator = require('../../validator/budgetPlanValidator');
const authMiddleware = require('../../middleware/authMiddleware');
const designMiddleware = require('../../middleware/designs/designMiddleware');
const budgetPlanController = require('../../controllers/designs/budgetPlanController');

router.post('/designs/:id/budget-plans',
    budgetPlanValidator.validateBudgetPlanPayload,
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyUserAccess({ accessRole: ["designer"] }),
    designMiddleware.verifyDesignAccess,
    budgetPlanController.createBudgetPlan
);

router.get('/designs/:id/budget-plans',
    budgetPlanController.getBudgetPlan
);

router.put('/designs/:id/budget-plans',
    budgetPlanValidator.validateBudgetPlanPayload,
    authMiddleware.verifyAccessToken,
    authMiddleware.verifyUserAccess({ accessRole: ["designer"] }),
    designMiddleware.verifyDesignAccess,
    budgetPlanController.deleteBudgetPlan,
    budgetPlanController.createBudgetPlan
);

module.exports = router;