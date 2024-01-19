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
    const article = await db.query(`
    SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, articles.body, 
    COALESCE(CAST(COUNT(comments.article_id) AS INTEGER), 0) AS comment_count 
    FROM articles 
    LEFT JOIN comments on comments.article_id = articles.article_id 
    WHERE articles.article_id = $1 
    GROUP BY articles.article_id;
    `, [article_id])
    if (article.rows.length !== 1) {
        return Promise.reject({ status: 404, msg: 'Not Found - There are no articles with that article_id number' });
    }
    return article.rows[0]
}

exports.fetchArticles = async (topic, sort_by = 'created_at', order = 'desc') => {

    if (!['author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'article_img_url', 'comment_count'].includes(sort_by)) {
        return Promise.reject({ status: 400, msg: 'Bad Request - invalid sort_by query value'});
    }
    
    if (!['asc', 'desc'].includes(order)) {
        return Promise.reject({ status: 400, msg: 'Bad Request - invalid order query' });
    }

    let queryValues = []
    let query = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COALESCE(CAST(COUNT(comments.article_id) AS INTEGER), 0) AS comment_count
    FROM articles LEFT JOIN comments on comments.article_id = articles.article_id`
    if (topic) {
        query += ` WHERE articles.topic = $1`
        queryValues.push(topic)
    }
    query += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`
    const articles = await db.query(query, queryValues)
    return articles.rows
}

exports.fetchCommentsByArticleId = async (article_id) => {
    const comments = await db.query(`
    SELECT * FROM comments WHERE article_id = $1
    ORDER by created_at DESC
    `, [article_id])
    return comments.rows
}

exports.addComment = async (article_id, username, body) => {
    const comment = await db.query(`
    INSERT INTO comments
    (body, author, article_id)
    VALUES
    ($1, $2, $3)
    RETURNING *
    `, [body, username, article_id])
    return comment.rows[0]
}

exports.updateArticle = async (article_id, inc_votes) => {
    const article = await db.query(`
    UPDATE articles
    SET
    votes = votes + $1
    WHERE article_id = $2
    RETURNING *
    `, [inc_votes, article_id])
    if (article.rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'Not Found - article_id does not exist' })
    }
    return article.rows[0]
}

exports.removeCommentById = async (comment_id) => {
    await db.query(`
    DELETE FROM comments
    WHERE comment_id = $1`, [comment_id])
}

exports.fetchUsers = async () => {
    const users = await db.query('SELECT * FROM users')
    return users.rows
}

exports.fetchUserById = async (username) => {
    const user = await db.query('SELECT * FROM users WHERE username = $1', [username])
    return user.rows[0]
}

exports.updateComment = async (inc_votes, comment_id) => {
    const comment = await db.query(`
    UPDATE comments
    SET
    votes = votes + $1
    WHERE comment_id = $2
    RETURNING *
    `, [inc_votes, comment_id])
    return comment.rows[0]
}

exports.addArticle = async (author, title, body, topic, article_img_url) => {
    const article = await db.query(`
    INSERT INTO articles
    (author, title, body, topic, article_img_url)
    VALUES
    ($1, $2, $3, $4, $5)
    RETURNING *
    `, [author, title, body, topic, article_img_url])
    const newArticleId = article.rows[0].article_id
    const articleInfo = await this.fetchArticleById(newArticleId)
    return articleInfo
}