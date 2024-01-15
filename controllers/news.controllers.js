const { fetchTopics, fetchEndpoints, fetchArticleById, fetchAllArticles } = require('../models/news.models')

exports.getTopics = async (req, res, next) => {
    try {
        const listOfTopics = await fetchTopics()
        res.status(200).send({topics: listOfTopics})
    }
    catch(err) {
        next(err)
    }
}

exports.getEndpoints = async (req, res, next) => {
    try {
        const endpoints = await fetchEndpoints()
        res.status(200).send({endpoints: endpoints})
    }
    catch(err) {
        next(err)
    }
}

exports.getArticlesById = async (req, res, next) => {
    const { article_id } = req.params
    try {
        const article = await fetchArticleById(article_id)
        res.status(200).send({article: article})
    }
    catch(err) {
        next(err)
    }
}

exports.getAllArticles = async (req, res, next) => {
    try {
    const articles = await fetchAllArticles()
    res.status(200).send({articles: articles})    
    }
    catch(err) {
        next(err)
    }
}