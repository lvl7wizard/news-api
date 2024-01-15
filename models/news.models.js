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

exports.fetchAllArticles = async () => {
    const articles = await db.query(`
    SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(articles.article_id) AS INTEGER) AS comment_count
    FROM articles
    LEFT JOIN comments on comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC
    `)
    return articles.rows
}