const express = require('express');
const app = express();
const { getTopics, getEndpoints, getArticlesById, getAllArticles, getCommentsByArticleId } = require('./controllers/news.controllers')

app.get('/api/topics', getTopics);
app.get('/api', getEndpoints);
app.get('/api/articles', getAllArticles);
app.get('/api/articles/:article_id', getArticlesById);
app.get('/api/articles/:article_id/comments', getCommentsByArticleId)


app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({msg: err.msg})
    } else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({msg: "Bad Request - article_id must be a number"})
    } else {
        next(err)
    }
})

app.use((err, req, res, next) => {
        res.status(500).send({msg: "Internal Server Error"})
})

app.use((req, res, next) => {
    res.status(404).send({msg: "Bad Request - Endpoint does not exist"})
})

module.exports = app