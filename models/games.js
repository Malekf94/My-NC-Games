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
		.query("SELECT * from reviews ORDER BY created_at DESC")
		.then(({ rows }) => {
			rows.forEach((row) => {
				row.comment_count = 0;
			});
			return rows;
		})
		.then((body) => {
			const reviews = body;
			return db.query(`SELECT * from comments`).then(({ rows }) => {
				rows.forEach((row) => {
					for (let i = 0; i < reviews.length; i++) {
						if (row.review_id === reviews[i].review_id) {
							reviews[i].comment_count++;
						}
					}
				});
				return reviews;
			});
		});
};
