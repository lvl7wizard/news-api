const usersRouter = require('express').Router();
const { getUsers } = require('../controllers/news.controllers')

usersRouter.route('/')
.get(getUsers);

module.exports = usersRouter;