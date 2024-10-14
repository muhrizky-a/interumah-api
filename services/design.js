const User = require('../models/user');
const Design = require("../models/design");
const NotFoundError = require('../exceptions/NotFoundError');

const createDesign = async (payload) => {
    const design = await Design.create(payload);
    return design;
}

const getDesigns = async (options) => {
    const designs = await Design.findAndCountAll(options);
    return designs;
}

const getDesignById = async (id, includeDesigner = false) => {
    const options = {
        where: { id }
    };

    if (includeDesigner) {
        options.include = {
            model: User
        };
    }

    const design = await Design.findOne(options);
    return design;
}

const mapDBtoDesignData = (req, design) => {
    return {
        id: design.id,
        categoryId: design.categoryId,
        title: design.title,
        description: design.description,
        area: design.area,
        imageUrl: `${req.headers.host}/uploads/designs/${design.image}`,
        price: design.price ?? '-',
        location: design.user.address ?? '-',
        designer: {
            id: design.user_id,
            name: design.user.name ?? '-',
            email: design.user.email,
            location: design.user.address ?? '-',
            imageUrl: `${req.headers.host}/uploads/users/profile/${design.user.image ?? 'default.png'}`,
        }
    }
}

const updateDesign = async (id, payload) => {
    const design = await Design.update(payload, {
        where: { id }
    });

    if (!design) throw new NotFoundError('Desain Interior tidak ditemukan.');
    return design;
}

const deleteDesign = async (id) => {
    const design = await Design.destroy({
        where: { id }
    });

    if (!design) throw new NotFoundError('Desain Interior tidak ditemukan.');
}

module.exports = {
    createDesign,
    getDesigns,
    getDesignById,
    mapDBtoDesignData,
    updateDesign,
    deleteDesign
};