const { getEndpoints } = require('../controllers/news.controllers');

const apiRouter = require('express').Router();
const topicsRouter = require('./topics-router');
const usersRouter = require('./users-router');
const commentsRouter = require('./comments-router');
const articlesRouter = require('./articles-router');

apiRouter.get('/', getEndpoints);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/articles', articlesRouter);

module.exports = apiRouter;