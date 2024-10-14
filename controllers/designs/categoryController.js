const categoryService = require('../../services/category');

const createCategory = async (req, res, next) => {
    try {
        const { name } = req.body;

        await categoryService.createCategory({ name });

        res.status(201).json({
            code: 201,
            data: {
                name
            }
        });
    } catch (error) {
        next(error);
    }
}

const getCategories = async (req, res, next) => {
    try {
        const categories = await categoryService.getCategories();

        res.json({
            code: 200,
            data: {
                categories: categories.rows.map(category => categoryService.mapDBtoCategoryData(req, category)),
            }
        });
    } catch (error) {
        next(error);
    }
}

const getCategoryById = async (req, res, next) => {
    try {
        const category = await categoryService.getCategoryById(req.params.id);

        res.json({
            code: 200,
            data: categoryService.mapDBtoCategoryData(req, category)
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
};