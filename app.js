const express = require("express");
const {
	getCategories,
	getReviewById,
	patchReview,
	getUsers,
	getReviews,
	getReviewCommentsById,
	postCommentByID,
} = require("./controllers/games");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewById);
app.patch("/api/reviews/:review_id", patchReview);
app.get("/api/users", getUsers);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id/comments", getReviewCommentsById);
app.post("/api/reviews/:review_id/comments", postCommentByID);

//////////////////////////////////////////
app.use((err, req, res, next) => {
	if (err.status && err.msg) {
		res.status(err.status).send({ msg: err.msg });
	} else if (err.code === "22P02") {
		res.status(400).send({ msg: "Bad Request!" });
	} else if (err.code === "23503") {
		res.status(400).send({ msg: err.msg });
	}
});

module.exports = app;
