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