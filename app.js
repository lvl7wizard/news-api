const express = require('express');
const app = express();
const { getTopics, getEndpoints } = require('./controllers/news.controllers')

app.get('/api/topics', getTopics);
app.get('/api', getEndpoints)



app.use((err, req, res, next) => {
        res.status(500).send({msg: "Internal server error"})
})

app.use((req, res, next) => {
    res.status(404).send({msg: "Endpoint does not exist"})
})

module.exports = app