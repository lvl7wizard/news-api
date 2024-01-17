const db = require('../db/connection')

exports.checkArticleIdExists = async (article_id) => {
    const articleIds = await db.query(`
    SELECT * FROM articles
    WHERE article_id = $1`, [article_id])
    if (articleIds.rows.length === 0) {
        return Promise.reject({status: 404, msg: 'Not Found - article_id does not exist'})
    }
}

exports.checkCommentIdExists = async (comment_id) => {
    const commentCheck = await db.query(`
    SELECT * FROM comments
    WHERE comment_id = $1
    `, [comment_id])
    if (commentCheck.rows.length === 0) {
        return Promise.reject({status: 404, msg: "Not Found - no comments with that comment_id exist"})
    }
}