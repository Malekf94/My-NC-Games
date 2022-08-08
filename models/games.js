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

exports.fetchReviews = (sort_by = "created_at", order = "DESC", category) => {
	const queryValue = [];
	const sortByProperties = [
		"owner",
		"title",
		"review_id",
		"category",
		"review_img_url",
		"created_at",
		"votes",
		"designer",
		"comment_count",
	];
	if (!sortByProperties.includes(sort_by)) {
		return Promise.reject({
			status: 400,
			msg: "invalid sort_by query",
		});
	}
	if (order.toUpperCase() != "ASC" && order.toUpperCase() != "DESC") {
		return Promise.reject({
			status: 400,
			msg: "invalid order input",
		});
	}
	let queryStr = `SELECT reviews.*, COUNT(comment_id) AS comment_count FROM reviews LEFT JOIN comments 
	ON reviews.review_id=comments.review_id `;
	if (category !== undefined) {
		queryValue.push(category);
		queryStr += `WHERE reviews.category = $1 `;
	}
	queryStr += `GROUP BY reviews.review_id ORDER BY ${sort_by} ${order}`;

	const fetchQuery = db.query(queryStr, queryValue).then(({ rows }) => {
		return rows;
	});
	if (category !== undefined) {
		const checkingCategory = validityCheck("reviews", "category", category);
		return Promise.all([checkingCategory, fetchQuery]);
	} else return Promise.all([fetchQuery, fetchQuery]);
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
					status: 200,
					msg: `No comment related`,
				});
			} else return rows;
		});

	return Promise.all([valid_id, comment]).then((values) => {
		return values[1];
	});
};

exports.addCommentById = (review_id, newComment) => {
	const newUsername = newComment.username;
	const newBody = newComment.body;
	if (!newUsername || !newBody) {
		return Promise.reject({
			status: 400,
			msg: "post missing username/body",
		});
	}
	const valid_id = validityCheck("reviews", "review_id", review_id);
	const valid_username = db
		.query(`SELECT * from comments WHERE author=$1`, [newUsername])
		.then(({ rows }) => {
			if (rows[0] === undefined) {
				return Promise.reject({
					status: 404,
					msg: `Username Not Found`,
				});
			} else return rows[0];
		});
	const insertedComment = db
		.query(
			`INSERT INTO comments(review_id, author, body) VALUES ($1, $2, $3) RETURNING *;`,
			[review_id, newUsername, newBody]
		)
		.then(({ rows }) => {
			return rows;
		});
	return Promise.all([valid_id, valid_username, insertedComment]);
};

exports.removeCommentById = (comment_id) => {
	const commentdIDCheck = validityCheck("comments", "comment_id", comment_id);
	const commentQuery = db.query("DELETE FROM comments WHERE comment_id=$1", [
		comment_id,
	]);
	return Promise.all([commentdIDCheck, commentQuery]);
};

exports.fetchUserByName = (username) => {
	const userNameCheck = validityCheck("users", "username", username);
	const fetchQuery = db
		.query(`SELECT * FROM users WHERE username=$1`, [username])
		.then(({ rows }) => {
			return rows[0];
		});
	return Promise.all([userNameCheck, fetchQuery]);
};

//////////////////////////////////////////////////////////
const validityCheck = (dataFile, column, property) => {
	const queryStr = `SELECT * FROM ${dataFile} WHERE ${column}=$1`;
	return db.query(queryStr, [property]).then(({ rows }) => {
		if (rows[0] === undefined) {
			return Promise.reject({
				status: 404,
				msg: `${property} was not found in column ${column}`,
			});
		} else return rows[0];
	});
};
