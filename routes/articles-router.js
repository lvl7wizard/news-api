const articlesRouter = require('express').Router();
const { getArticles, getArticlesById, getCommentsByArticleId, postComment, patchArticle } = require('../controllers/news.controllers')

articlesRouter.route('/')
.get(getArticles);
articlesRouter.route('/:article_id')
.get(getArticlesById)
.patch(patchArticle);
articlesRouter.route('/:article_id/comments')
.get(getCommentsByArticleId)
.post(postComment);

module.exports = articlesRouter;