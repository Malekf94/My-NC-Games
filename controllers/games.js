const { fetchCategories } = require("../models/games");

exports.getCategories = (req, res, next) => {
	fetchCategories().then((categories) => {
		res.status(200).send({ categories });
	});
};
