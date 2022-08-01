const { fetchCategories, fetchReview } = require("../models/games");

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
