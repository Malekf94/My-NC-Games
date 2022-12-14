const { getUsers, getUserByName } = require("../controllers/games");

const userRouter = require("express").Router();

userRouter.get("/", getUsers);
userRouter.get("/:username", getUserByName);

module.exports = userRouter;
