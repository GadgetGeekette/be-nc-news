const {getArticleByIdQuery, getArticlesQuery, patchArticleQuery} = require('../models/article-model');
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
    const topic = req.body.topic;
    let promises = [];

    if (topic && typeof topic !== 'string') {
        res.status(400).send({msg: 'Bad request'})
    }
    else if (topic  && topic !== '') {
        // filtered by topic
        promises.push(getTopic(topic, next));
        promises.push(getArticlesQuery(next, topic));
    }
    else {
        // not filtered by topic
        promises.push(getArticlesQuery(next))
    }

    Promise.all(promises)
        .then((result) => {
            if (topic) {
                // filtered by topic
                res.status(200).send({articles: result[1]});
            }
            else {
                // not filtered by topic
                res.status(200).send({articles: result[0]});
            }
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


