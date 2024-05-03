const articlesRouter = require('express').Router();
const { getArticles, getArticlesById, getCommentsByArticleId, postComment, patchArticle, postArticle, deleteArticle } = require('../controllers/news.controllers');

articlesRouter.route('/')
.get(getArticles)
.post(postArticle);
articlesRouter.route('/:article_id')
.get(getArticlesById)
.patch(patchArticle)
.delete(deleteArticle);
articlesRouter.route('/:article_id/comments')
.get(getCommentsByArticleId)
.post(postComment);

module.exports = articlesRouter;