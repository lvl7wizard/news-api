exports.handleCustomErrors = (err, req, res, next) => {
        if (err.status && err.msg) {
            res.status(err.status).send({msg: err.msg})
        } else {
            next(err)
        }
}

exports.handlePsqlErrors = (err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({msg: "Bad Request - parametric endpoint must be a number"})
    } else if (err.code === '23503') {
        if (err.constraint === 'comments_author_fkey') {
            res.status(400).send({msg: "Bad Request - user does not exist"})
        } else if (err.constraint === 'comments_article_id_fkey') {
            res.status(404).send({msg: "Not Found - article_id does not exist"})
        } else if (err.constraint === 'articles_topic_fkey') {
            res.status(400).send({msg: "Bad Request - topic does not exist"})
        } else if (err.constraint === 'articles_author_fkey') {
            res.status(400).send({msg: "Bad Request - author does not exist"})    
        } else {
            next(err)
        }
    } else if (err.code === '23502') {
        res.status(400).send({msg: "Bad Request - request body must contain all required keys"})
    } else {
        next(err)
    }
};

exports.handleServerErrors = (err, req, res, next) => {
    res.status(500).send({msg: "Internal Server Error"})
}