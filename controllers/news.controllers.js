const { fetchTopics, fetchEndpoints } = require('../models/news.models')

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