const {getApiDataQuery} = require('../models/core-api-model');

exports.getApiData = (req, res, next) => {
    const results = getApiDataQuery(next);
    return res.status(200).send({msg: results});
};