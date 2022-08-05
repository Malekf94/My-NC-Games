const { deleteCommentById } = require("../controllers/games");

const commentsRouter = require("express").Router();

commentsRouter.delete("/:comment_id", deleteCommentById);

module.exports = commentsRouter;
