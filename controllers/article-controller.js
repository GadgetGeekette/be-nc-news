const {getArticleByIdQuery, getArticlesQuery, patchArticleQuery, postArticleQuery} = require('../models/article-model');
const { getTopic } = require('../models/topic-model');

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

    let sort_by;
    let order;
    let topic;

    if (req.query.sort_by) {
        sort_by = req.query.sort_by;
    }
    else {
        // set default sort by
        sort_by = 'created_at';
    };

    if (req.query.order) {
        order = req.query.order;
    }
    else {
        // set default order
        order = 'DESC';
    };

    if (req.query.topic) {
        topic = req.query.topic;
    };

    return getArticlesQuery(next, sort_by, order, topic)

        .then((result) => {
            if (topic && result.length === 0) {
                // topic does not exist
                return res.status(404).send({msg: 'Not found'});
            }
            res.status(200).send({articles: result});
        })
        .catch((err) => {
            next(err);
        });
});

exports.patchArticle = ((req, res, next) => {
    return patchArticleQuery(req.params.id, req.body.inc_votes, next)
        .then((result) => {
            res.status(200).send({article: result});
        })
        .catch((err) => {
            next(err);
        });
});

exports.postArticle = (req, res, next) => {
    
    if (!validArticlePostData(req.body)) {
        return res.status(400).send({msg: 'Bad request'})
    }

    return postArticleQuery(req.body, next)
        .then((result) => {
            result.comment_count = 0;
            res.status(201).send({article: result});
        })
        .catch((err) => {
            next(err);
        });     
};

function validArticlePostData (article) {
    if (!article
        || !article.author
        || !article.title
        || !article.body
        || !article.topic
        || !article.article_img_url) {
            return false;
        }
    return true;
};

