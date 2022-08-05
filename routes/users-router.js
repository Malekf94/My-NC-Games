const { getUsers } = require("../controllers/games");

const userRouter = require("express").Router();

userRouter.get("/", getUsers);

module.exports = userRouter;
