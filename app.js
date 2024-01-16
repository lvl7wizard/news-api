const express = require('express');
const app = express();
const { getTopics, getEndpoints, getArticlesById, getAllArticles, getCommentsByArticleId, postComment, patchArticle } = require('./controllers/news.controllers')
app.use(express.json())

app.get('/api/topics', getTopics);
app.get('/api', getEndpoints);
app.get('/api/articles', getAllArticles);
app.get('/api/articles/:article_id', getArticlesById);
app.get('/api/articles/:article_id/comments', getCommentsByArticleId)
app.post('/api/articles/:article_id/comments', postComment)
app.patch('/api/articles/:article_id', patchArticle)

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
    } else if (err.code === '23503') {
        if (err.constraint === 'comments_author_fkey') {
            res.status(400).send({msg: "Bad Request - user does not exist"})
        } else if (err.constraint === 'comments_article_id_fkey') {
            res.status(404).send({msg: "Not Found - article_id does not exist"})
        } else {
            next(err)
        }
    } else if (err.code === '23502') {
        if (err.column === 'votes') {
            res.status(400).send({msg: "Bad Request - body must contain a valid inc_votes key"})           
        } else if (err.column === 'author') {
            res.status(400).send({msg: "Bad Request - body must contain valid username and body keys"})
        } else {
            next(err)
        }
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