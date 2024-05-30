const {getCommentsByArticleQuery, postCommentQuery} = require('../models/comment-model');
const {getArticleByIdQuery} = require('../models/article-model');

exports.getCommentsByArticle = ((req, res, next) => {
    const promises = [
        getArticleByIdQuery(req.params.id, next),
        getCommentsByArticleQuery(req.params.id, next)
    ];

    Promise.all(promises)
        .then((results) => {
            res.status(200).send({comments: results[1]});
        })
        .catch(next);
});

exports.postComment = (req, res, next) => {
    if (!req.body.username || !req.body.body) {
        return res.status(400).send({msg: 'Bad request'})
    }

    const promises = [
        getArticleByIdQuery(req.params.id, next),
        postCommentQuery(req.body.body, req.params.id, req.body.username, next)
    ];

    Promise.all(promises)
        .then((result) => {
            res.status(201).send({comment: result[1]});
        })
        .catch((err) => {
            next(err);
        });;
  };