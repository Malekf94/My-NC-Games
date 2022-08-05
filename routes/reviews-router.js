const {
	getReviewById,
	patchReview,
	getReviewCommentsById,
	postCommentByID,
	getReviews,
} = require("../controllers/games");

const reviewsRouter = require("express").Router();

reviewsRouter.get("/", getReviews);
reviewsRouter.get("/:review_id", getReviewById);
reviewsRouter.patch("/:review_id", patchReview);
reviewsRouter.get("/:review_id/comments", getReviewCommentsById);
reviewsRouter.post("/:review_id/comments", postCommentByID);

module.exports = reviewsRouter;
