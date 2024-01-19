const topicsRouter = require('express').Router();
const { getTopics } = require('../controllers/news.controllers');

topicsRouter.route('/')
.get(getTopics);

module.exports = topicsRouter;