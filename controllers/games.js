const users = require("../db/data/test-data/users");
const {
	fetchCategories,
	fetchReviewById,
	updateReview,
	fetchUsers,
	fetchReviews,
	fetchReviewCommentsById,
	addCommentById,
	removeCommentById,
} = require("../models/games");
const { listOfApis } = require("../endpoints.json");
exports.getCategories = (req, res, next) => {
	fetchCategories().then((categories) => {
		res.status(200).send({ categories });
	});
};

exports.getReviewById = (req, res, next) => {
	const { review_id } = req.params;
	fetchReviewById(review_id)
		.then((review) => {
			res.status(200).send({ review });
		})
		.catch((err) => {
			if (err) next(err);
		});
};

exports.patchReview = (req, res, next) => {
	const { review_id } = req.params;
	const { inc_votes } = req.body;
	updateReview(review_id, inc_votes)
		.then((review) => {
			res.status(200).send({ review });
		})
		.catch((err) => {
			if (err) next(err);
		});
};

exports.getUsers = (req, res, next) => {
	fetchUsers().then((users) => {
		res.status(200).send({ users });
	});
};

exports.getReviews = (req, res, next) => {
	const { sort_by, order, category } = req.query;
	fetchReviews(sort_by, order, category)
		.then((reviews) => {
			res.status(200).send({ reviews: reviews[1] });
		})
		.catch(next);
};

exports.getReviewCommentsById = (req, res, next) => {
	const { review_id } = req.params;
	fetchReviewCommentsById(review_id)
		.then((comments) => {
			res.status(200).send({ comments });
		})
		.catch((err) => {
			if (err) next(err);
		});
};

exports.postCommentByID = (req, res, next) => {
	const { review_id } = req.params;
	addCommentById(review_id, req.body)
		.then((comment) => {
			res.status(201).send({ comment: comment[2][0] });
		})
		.catch(next);
};

exports.deleteCommentById = (req, res, next) => {
	const { comment_id } = req.params;
	removeCommentById(comment_id)
		.then(() => {
			res.sendStatus(204);
		})
		.catch(next);
};

exports.getApi = (req, res, next) => {
	res.status(200).send({ listOfApis });
};
