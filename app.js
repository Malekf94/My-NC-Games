const express = require("express");
const { welcomePage } = require("./controllers/games");
const apiRouter = require("./routes/api-router");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", welcomePage);
app.use("/api", apiRouter);

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
