const db = require('../db/connection');
const fs = require('fs/promises');

exports.fetchTopics = async () => {
    topics = await db.query('SELECT * FROM topics')
    return topics.rows
}

exports.fetchEndpoints = async () => {
    const endpoints = JSON.parse(await fs.readFile("./endpoints.json", "utf-8"))
    return endpoints
}

exports.fetchArticleById = async (article_id) => {
    const article = await db.query('SELECT * FROM articles WHERE article_id = $1', [article_id])
    if (article.rows.length !== 1) {
        return Promise.reject({ status: 404, msg: 'Not Found - There are no articles with that article_id number' });
    }
    return article.rows[0]
}