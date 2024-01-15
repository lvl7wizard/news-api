const express = require('express');
const app = express();
const { getTopics } = require('./controllers/news.controllers')

// endpoints

app.get('/api/topics', getTopics);

// error handling
app.use((err, req, res, next) => {
        // console.log(err)
        res.status(500).send({msg: "Internal Server Error"})
})

module.exports = app