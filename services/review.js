const Design = require("../models/design");
const Review = require("../models/review");
const User = require("../models/user");


const mapDBtoReviewData = (req, review) => {
    return {
        id: review.id,
        designTitle: review.design.title,
        designImageUrl: `${req.headers.host}/uploads/designs/${review.design.image}`,
        reviewer: {
            name: review.user.name,
            imageUrl: `${req.headers.host}/uploads/users/profile/${review.user.image ?? 'default.png'}`,
        },
        designRating: review.design_rating,
        designerRating: review.designer_rating,
        designComments: review.design_comments,
        designerComments: review.designer_comments
    };
}

const createReview = async (payload) => {
    const review = await Review.create(payload);

    return {
        id: review.id
    };
}

const getReviews = async (designId) => {
    const reviews = await Review.findAndCountAll({
        include: [
            {
                model: Design,
                where: { id: designId },
                attributes: ['id', 'title', 'image'],
            },
            {
                model: User,
                attributes: ['id', 'name', 'image'],
            }
        ]
    });

    return reviews;
}

const getReviewsCreated = async (userId) => {
    const reviews = await Review.findAndCountAll({
        include: [
            {
                model: Design,
                attributes: ['id', 'title', 'image'],
            },
            {
                model: User,
                where: {
                    id: userId
                },
                attributes: ['id', 'name', 'image'],
            }
        ]
    });

    return reviews;
}

const getReviewById = async (designId, reviewId) => {
    const review = await Review.findOne({
        where: {
            id: reviewId,
            design_id: designId
        },
        include: [
            {
                model: Design,
                attributes: ['id', 'title', 'image'],
            },
            {
                model: User,
                attributes: ['id', 'name', 'image'],
            }
        ]
    });
    return review;
}

module.exports = {
    mapDBtoReviewData,
    createReview,
    getReviews,
    getReviewsCreated,
    getReviewById
};