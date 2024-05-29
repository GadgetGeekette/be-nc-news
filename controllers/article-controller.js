const {getArticleByIdQuery, getArticlesQuery} = require('../models/article-model');

exports.getArticleById = (req, res, next) => {
    return getArticleByIdQuery(req.params.id, next)
        .then((result) => {
            res.status(200).send({article: result});
        })
        .catch((err) => {
            next(err);
        });;
};

exports.getArticles = ((req, res, next) => {
    return getArticlesQuery(next)
        .then((result) => {
            res.status(200).send({articles: result});
        })
        .catch((err) => {
            next(err);
        });
});


