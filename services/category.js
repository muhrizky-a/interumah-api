const NotFoundError = require('../exceptions/NotFoundError');
const Category = require('../models/category');

const createCategory = async (payload) => {
    await Category.create(payload);
}

const getCategories = async () => {
    const categories = await Category.findAndCountAll();
    return categories;
}

const getCategoryById = async (id) => {
    const category = await Category.findOne({
        where: { id }
    });

    if (!category) throw new NotFoundError('Kategori tidak ditemukan.');
    return category;
}

const mapDBtoCategoryData = (req, category) => {
    return {
        id: category.id,
        name: category.name,
        description: category.description ?? `${category.name} memiliki peran penting buat anda.`,
        background: `${req.headers.host}/uploads/categories/backgrounds/default.png`,
        icon: `${req.headers.host}/uploads/categories/icons/default.png`,
    }
}

module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    mapDBtoCategoryData
};