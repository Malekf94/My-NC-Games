const express = require("express");
const { getCategories, getReview } = require("./controllers/games");

const app = express();

// app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReview);

//////////////////////////////////////////
app.use((err, req, res, next) => {
	if (err.status && err.msg) {
		res.status(err.status).send({ msg: err.msg });
	} else if (err.code === "22P02") {
		res.status(400).send({ msg: "Bad Request!" });
	}
});

module.exports = app;
