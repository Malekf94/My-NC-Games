const { getCategories } = require("../controllers/games");

const categoriesRouter = require("express").Router();

categoriesRouter.get("/", getCategories);

module.exports = categoriesRouter;
