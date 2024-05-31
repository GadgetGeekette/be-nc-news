const {getUsersQuery, getUserQuery} = require('../models/user-model');

exports.getUsers = (req, res, next) => {
    return getUsersQuery(next)
        .then((result) => {
            res.status(200).send({users: result});
        })
        .catch((err) => {
            next(err);
        });;
};

exports.getUser = (req, res, next) => {
    if (!req.body.username || typeof req.body.username !== 'string') {
        res.status(400).send({msg: 'Bad request'})
    }

    return getUserQuery(req.body.username, next)
        .then((result) => {
            res.status(200).send({user: result});
        })
        .catch((err) => {
            next(err);
        });;
};