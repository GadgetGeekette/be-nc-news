const {getUsersQuery} = require('../models/user-model');

exports.getUsers = (req, res, next) => {
    return getUsersQuery(next)
        .then((result) => {
            res.status(200).send({users: result});
        })
        .catch((err) => {
            next(err);
        });;
};