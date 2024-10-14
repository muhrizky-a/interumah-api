const User = require('../models/user');
const bookmarkService = require('../services/bookmark');
const Bookmark = require('../models/bookmark');
const Design = require('../models/design');

const handleAddOrDelete = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { id } = req.params;

        const bookmark = await bookmarkService.getBookmarkById(userId, id);

        if (bookmark) {
            await bookmarkService.deleteBookmark(bookmark);
            res.status(200).json({
                code: 200,
                message: "Bookmark berhasil dihapus."
            });
        } else {
            await bookmarkService.createBookmark({
                user_id: userId,
                design_id: id
            });

            res.status(201).json({
                code: 201,
                message: "Bookmark berhasil ditambahkan."
            });
        }
    } catch (error) {
        next(error);
    }
}

const getBookmarks = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const bookmarks = await bookmarkService.getBookmarks(userId);

        res.json({
            code: 200,
            data: bookmarks.map(bookmark => bookmarkService.mapDBtoBookmarkData(req, bookmark))
        });
    } catch (error) {
        next(error);
    }
}



module.exports = {
    handleAddOrDelete,
    getBookmarks
};