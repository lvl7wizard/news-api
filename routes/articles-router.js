const articlesRouter = require('express').Router();
const { getArticles, getArticlesById, getCommentsByArticleId, postComment, patchArticle, postArticle } = require('../controllers/news.controllers');
const { removeArticleById } = require('../models/news.models');

articlesRouter.route('/')
.get(getArticles)
.post(postArticle);
articlesRouter.route('/:article_id')
.get(getArticlesById)
.patch(patchArticle)
.delete(removeArticleById);
articlesRouter.route('/:article_id/comments')
.get(getCommentsByArticleId)
.post(postComment);

module.exports = articlesRouter;