const {getTopicsQuery} = require('../models/topic-model');

exports.getTopics = (req, res, next) => {
    return getTopicsQuery(req, res, next)
        .then((result) => {
            res.status(200).send(result);
        });
};