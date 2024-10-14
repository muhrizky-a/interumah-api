const sequelize = require('sequelize');
const User = require('../../models/user');
const Design = require('../../models/design');
const Review = require('../../models/review');

const reviewService = require('../../services/review');

const NotFoundError = require('../../exceptions/NotFoundError');

const HTTPReviewsResponse = (req, reviews, useReview = true) => {
    let designRatingAverage = 0, designerRatingAverage = 0;

    const data = reviews.rows.map(review => {
        designRatingAverage += review.design_rating;
        designerRatingAverage += review.designer_rating;

        return reviewService.mapDBtoReviewData(req, review);
    });

    const review = useReview ?
        {
            designRatingAverage: (designRatingAverage / reviews.count).toFixed(2),
            designerRatingAverage: (designerRatingAverage / reviews.count).toFixed(2),
        }
        : null;

    return {
        code: 200,
        data,
        page: {
            size: reviews.count,
        },
        review
    };
}

const createReview = async (req, res, next) => {
    try {
        const { designId } = req.params;

        const {
            designRating,
            designerRating,
            designComments,
            designerComments
        } = req.body;

        const review = await reviewService.createReview({
            customer_id: req.user.id,
            design_id: designId,
            design_rating: designRating,
            designer_rating: designerRating,
            design_comments: designComments,
            designer_comments: designerComments
        });

        res.status(201).json({
            code: 201,
            message: "Review berhasil ditambah.",
            data: {
                id: review.id,
                designRating,
                designerRating,
                designComments,
                designerComments
            }
        });
    } catch (error) {
        next(error);
    }
}

const getReviews = async (req, res, next) => {
    try {
        const { id } = req.params;

        const reviews = await reviewService.getReviews(id);

        res.status(200).json(HTTPReviewsResponse(req, reviews));
    } catch (error) {
        next(error);
    }
}

const getReviewById = async (req, res, next) => {
    try {
        const { designId, reviewId } = req.params;

        const design = await Design.findOne({
            where: { id: designId }
        });
        if (!design) throw new NotFoundError('Design Interior tidak ada.');

        const review = await reviewService.getReviewById(designId, reviewId);
        if (!review) throw new NotFoundError('Review tidak ada.');

        res.json({
            code: 200,
            data: reviewService.mapDBtoReviewData(req, review)
        });
    } catch (error) {
        next(error);
    }
}

const getReviewsCreated = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const reviews = await reviewService.getReviewsCreated(userId);

        res.status(200).json(HTTPReviewsResponse(req, reviews));
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createReview,
    getReviews,
    getReviewById,
    getReviewsCreated
};