const db = require("../db/connection");

exports.fetchCategories = () => {
	return db.query("SELECT * from categories").then(({ rows }) => {
		return rows;
	});
};

exports.fetchReviewById = (review_id) => {
	return db
		.query(`SELECT * from reviews WHERE review_id=$1`, [review_id])
		.then(({ rows }) => {
			if (rows[0] === undefined) {
				return Promise.reject({
					status: 404,
					msg: `No review found`,
				});
			} else return rows[0];
		})
		.then((body) => {
			const review = body;
			return db
				.query(`SELECT * from comments WHERE review_id=$1`, [review_id])
				.then(({ rows }) => {
					review.comment_count = rows.length;
					return review;
				});
		});
};

exports.updateReview = (review_id, inc_votes) => {
	return db
		.query(
			`UPDATE reviews SET votes = votes + $2 WHERE review_id=$1 RETURNING *;`,
			[review_id, inc_votes]
		)
		.then(({ rows }) => {
			if (rows[0] === undefined) {
				return Promise.reject({
					status: 404,
					msg: `No review found`,
				});
			} else return rows[0];
		});
};

exports.fetchUsers = () => {
	return db.query("SELECT * from users").then(({ rows }) => {
		return rows;
	});
};

exports.fetchReviews = () => {
	return db
		.query(
			"SELECT reviews.*, COUNT(comment_id) AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id=comments.review_id GROUP BY reviews.review_id ORDER BY reviews.created_at DESC"
		)
		.then(({ rows }) => {
			return rows;
		});
};

exports.fetchReviewCommentsById = (review_id) => {
	const valid_id = db
		.query(`SELECT * from reviews WHERE review_id=$1`, [review_id])
		.then(({ rows }) => {
			if (rows[0] === undefined) {
				return Promise.reject({
					status: 404,
					msg: `No review found`,
				});
			} else return rows[0];
		});
	const comment = db
		.query(`SELECT * from comments WHERE review_id=$1`, [review_id])
		.then(({ rows }) => {
			if (rows.length === 0) {
				return Promise.reject({
					status: 404,
					msg: `No comment found`,
				});
			} else return rows;
		});

	return Promise.all([valid_id, comment]).then((values) => {
		return values[1];
	});
};
