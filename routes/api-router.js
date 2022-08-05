const { getApi } = require("../controllers/games");
const categoriesRouter = require("./categories-router");
const commentsRouter = require("./comments-router");
const reviewsRouter = require("./reviews-router");
const userRouter = require("./users-router");

const apiRouter = require("express").Router();

apiRouter.get("/", getApi);
apiRouter.use("/users", userRouter);
apiRouter.use("/reviews", reviewsRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/categories", categoriesRouter);

module.exports = apiRouter;
