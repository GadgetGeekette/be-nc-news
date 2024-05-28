const {getApiDataQuery} = require('../models/core-api-model');

exports.getApiData = (req, res, next) => {
    return getApiDataQuery(next)
        .then((result) => {
            return res.status(200).send({msg: result});
        })
        .catch((err) => {
            console.log(err, '--constroller err --');
            next(err)
        });
};