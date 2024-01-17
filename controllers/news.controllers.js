const { fetchTopics, fetchEndpoints, fetchArticleById, fetchArticles, fetchCommentsByArticleId, fetchUsers, addComment, updateArticle, removeCommentById } = require('../models/news.models')
const { checkArticleIdExists, checkCommentIdExists, checkTopicExists } = require('../utils/utils')

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

exports.getArticles = async (req, res, next) => {
    try {
    const { topic } = req.query
    if (topic) {
        const topicExists = await checkTopicExists(topic)
    }
    const articles = await fetchArticles(topic)
    res.status(200).send({articles: articles})    
    }
    catch(err) {
        next(err)
    }
}

exports.getCommentsByArticleId = async (req, res, next) => {
    try {
        const { article_id } = req.params
        const articleIdExists = checkArticleIdExists(article_id)
        const comments = fetchCommentsByArticleId(article_id)
        const queries = [comments, articleIdExists]
        const resolvedQueries = await Promise.all(queries)
        res.status(200).send({comments: resolvedQueries[0]})
    }
    catch(err) {
        next(err)
    }
}

exports.postComment = async (req, res, next) => {
    try {
        const { article_id } = req.params
        const { username } = req.body
        const { body } = req.body
        const comment = await addComment(article_id, username, body)
        res.status(201).send({comment: comment})
    }
    catch(err) {
        next(err)
    }
}

exports.patchArticle = async (req, res, next) => {
    try {
        const { article_id } = req.params
        const { inc_votes } = req.body
        const article = await updateArticle(article_id, inc_votes)
        res.status(200).send({article: article})
    }
    catch(err) {
        next(err)
    }
}
exports.deleteComment = async (req, res, next) => {
    try {
        const { comment_id } = req.params
        await checkCommentIdExists(comment_id)
        await removeCommentById(comment_id)
        res.status(204).send()
    }
    catch(err) {
        next(err)
    }
}
exports.getUsers = async (req, res, next) => {
    try {
        const users = await fetchUsers()
        res.status(200).send({users: users})
    }
    catch(err) {
        next(err)
    }
}