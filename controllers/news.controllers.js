const { fetchTopics } = require('../models/news.models')

exports.getTopics = async (req, res, next) => {
    try {
        const listOfTopics = await fetchTopics()
        res.status(200).send({topics: listOfTopics})
    }
    catch(err) {
        next(err)
        console.log(err)
    }
}