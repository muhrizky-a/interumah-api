const Bookmark = require('../models/bookmark');
const Design = require('../models/design');
const User = require('../models/user');

const mapDBtoBookmarkData = (req, bookmark) => {
    return {
        favoriteId: bookmark.id,
        design: {
            id: bookmark.design.id,
            userId: bookmark.design.user_id,
            categoryId: bookmark.design.category_id,
            title: bookmark.design.title,
            price: bookmark.design.price ?? '-',
            location: bookmark.design.user.address ?? '-',
            designerName: bookmark.design.user.name,
            imageUrl: `${req.headers.host}/uploads/designs/${bookmark.design.image}`
        }
    };
}

const createBookmark = async (payload) => {
    const bookmark = await Bookmark.create(payload);

    return {
        id: bookmark.id
    };
}

const getBookmarks = async (userId) => {
    const bookmarks = await Bookmark.findAll({
        attributes: ['id'],
        where: {
            user_id: userId,
        },
        include:
        {
            model: Design,
            include: {
                model: User,
                attributes: ['name', 'address']
            },
        },
    });

    return bookmarks;
}

const getBookmarkById = async (userId, designId) => {
    const bookmark = await Bookmark.findOne({
        where: {
            user_id: userId,
            design_id: designId
        }
    });
    return bookmark;
}

const deleteBookmark = async (bookmark) => {
    await bookmark.destroy();
}

module.exports = {
    mapDBtoBookmarkData,
    createBookmark,
    getBookmarks,
    getBookmarkById,
    deleteBookmark
};