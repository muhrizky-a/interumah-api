const router = require('express').Router();
const categoryValidator = require('../../validator/categoryValidator');
const designCategoryController = require('../../controllers/designs/categoryController');

router.post('/designs/categories',
    categoryValidator.validateCategoryPayload,
    designCategoryController.createCategory
);

router.get('/designs/categories',
    designCategoryController.getCategories
);

router.get('/designs/categories/:id',
    designCategoryController.getCategoryById
);

module.exports = router;