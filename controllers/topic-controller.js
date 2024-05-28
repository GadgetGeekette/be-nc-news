const {getTopicsQuery} = require('../models/topic-model');

exports.getTopics = (req, res, next) => {
    return getTopicsQuery(next)
        .then((result) => {
            res.status(200).send({topics: result});
        })
        .catch((err) => {
            next(err);
        });;
};