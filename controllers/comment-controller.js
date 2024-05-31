const {getCommentsByArticleQuery, postCommentQuery, deleteCommentQuery, patchCommentQuery} = require('../models/comment-model');
const {getArticleByIdQuery} = require('../models/article-model');

exports.getCommentsByArticle = ((req, res, next) => {
    const promises = [
        // separate queries required to enable differentiation between zero rows returned because the article ID doesn't exist and zero rows returned because the article has no comments
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

    return postCommentQuery(req.body.body, req.params.id, req.body.username, next)
        .then((result) => {
            if (result.length === 0){
                // invalid article ID
                res.status(400).send({msg: 'Bad request'});
            }
            res.status(201).send({comment: result});
        })
        .catch((err) => {
            next(err);
        });     
};

exports.deleteComment = (req, res, next) => {
    return deleteCommentQuery(req.params.id, next)
        .then((result) => {
            res.status(204).send();
        })
        .catch((err) => {
            next(err);
        });;
};

exports.patchComment = ((req, res, next) => {
    return patchCommentQuery(req.params.id, req.body.inc_votes, next)
        .then((result) => {
            res.status(200).send({comment: result});
        })
        .catch((err) => {
            next(err);
        });
});
