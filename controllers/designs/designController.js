const sequelize = require('sequelize');
const User = require('../../models/user');
const designService = require('../../services/design');
const { paginate } = require('../../services/common');

const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

const createDesign = async (req, res, next) => {
    try {
        const {
            category_id,
            title,
            description,
            price
        } = req.body;

        const { filename } = req.files[0];
        const { userId } = req.user;

        // Cek apakah gambar desain diupload
        if (!req.files[0]) throw new InvariantError(
            "BAD_REQUEST",
            {
                image: [
                    "Gambar Desain Interior tidak diupload"
                ]
            }
        );

        const design = await designService.createDesign({
            user_id: userId,
            category_id,
            title,
            description,
            price,
            image: filename
        });

        res.status(201).json({
            code: 201,
            data: {
                id: design.id,
                title: design.title,
            }
        });
    } catch (error) {
        next(error);
    }
}

const getDesigns = async (req, res, next) => {
    try {
        const { user, category, title } = req.query;
        let page = req.query.page;
        let size = req.query.size;

        // WHERE conditions
        const conditions = {}
        if (user) conditions.user_id = parseInt(user);
        if (category) conditions.category_id = parseInt(category);
        if (title) conditions.title = sequelize.where(sequelize.fn('LOWER', sequelize.col('title')), 'LIKE', '%' + title.toLowerCase() + '%');

        const options = {
            where: conditions,
            include: {
                model: User
            }
        }

        // Pagination options
        paginate(size, page, options);

        const designs = await designService.getDesigns(options);

        res.json({
            code: 200,
            data: designs.rows.map(design => designService.mapDBtoDesignData(req, design)),
            page: {
                size: designs.rows.length,
                total: designs.count,
                totalPages: Math.ceil(designs.count / (size ?? designs.count)),
                current: page ?? 1
            }
        });
    } catch (error) {
        next(error);
    }
}

const getDesignById = async (req, res, next) => {
    try {
        const design = await designService.getDesignById(req.params.id, true);
        if (!design) throw new NotFoundError('Desain Interior tidak ditemukan.');

        res.json({
            code: 200,
            data: designService.mapDBtoDesignData(req, design)
        });
    } catch (error) {
        next(error);
    }
}

const updateDesign = async (req, res, next) => {
    try {
        const data = req.body;
        await designService.updateDesign(req.params.id, data);

        res.status(200).json({
            code: 200,
            message: "Jasa Desain Interior berhasil diperbarui"
        });
    } catch (error) {
        next(error);
    }
}

const updateImage = async (req, res, next) => {
    try {
        const { filename } = req.files[0];

        // Cek apakah gambar desain diupload
        if (!req.files[0]) throw new InvariantError(
            "BAD_REQUEST",
            {
                image: [
                    "Gambar Desain Interior tidak diupload"
                ]
            }
        );

        await designService.updateDesign(req.params.id, { image: filename });

        res.status(200).json({
            code: 200,
            message: "Gambar Desain Interior berhasil diperbarui",
            data: {
                image: `${req.headers.host}/uploads/designs/${filename}`
            }
        });
    } catch (error) {
        next(error);
    }
}

const deleteDesign = async (req, res, next) => {
    try {
        await designService.deleteDesign(req.params.id);

        res.status(200).json({
            code: 200,
            message: "Jasa Desain Interior berhasil dihapus."
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createDesign,
    getDesigns,
    getDesignById,
    updateDesign,
    updateImage,
    deleteDesign
};