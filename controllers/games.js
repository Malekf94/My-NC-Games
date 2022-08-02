const users = require("../db/data/test-data/users");
const {
	fetchCategories,
	fetchReview,
	updateReview,
	fetchUsers,
} = require("../models/games");

exports.getCategories = (req, res, next) => {
	fetchCategories().then((categories) => {
		res.status(200).send({ categories });
	});
};

exports.getReview = (req, res, next) => {
	const { review_id } = req.params;
	fetchReview(review_id)
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
