const db = require("../db/connection");
exports.fetchCategories = () => {
	return db.query("SELECT * from categories").then(({ rows }) => {
		return rows;
	});
};

exports.fetchReview = (review_id) => {
	return db
		.query(`SELECT * from reviews WHERE review_id=$1`, [review_id])
		.then(({ rows }) => {
			if (rows[0] === undefined) {
				return Promise.reject({
					status: 404,
					msg: `No review found for review_id:${review_id}`,
				});
			} else return rows[0];
		});
};
