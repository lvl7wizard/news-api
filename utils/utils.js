const db = require('../db/connection')

exports.checkArticleIdExists = async (article_id) => {
    const articleIds = await db.query(`
    SELECT * FROM articles
    WHERE article_id = $1`, [article_id])
    if (articleIds.rows.length === 0) {
        return Promise.reject({status: 404, msg: 'Not Found - article_id does not exist'})
    }
}