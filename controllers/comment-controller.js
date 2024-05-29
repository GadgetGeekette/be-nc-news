const {getCommentsByArticleQuery} = require('../models/comment-model');
const {getArticleByIdQuery} = require('../models/article-model');

exports.getCommentsByArticle = ((req, res, next) => {
    const promises = [
        getArticleByIdQuery(req.params.id, next),
        getCommentsByArticleQuery(req.params.id, next)
    ];

    Promise.all(promises)
        .then((results) => {
            console.log(results[0],'--promise article results')
            console.log(results[1],'--promise comments results')
            res.status(200).send({comments: results[1]});
        })
        .catch(next);
});
