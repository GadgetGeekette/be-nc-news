const db = require('../db/connection');
const moment = require('moment');

exports.getArticleByIdQuery = ((id, next) => {   
    return db.query(`SELECT a.article_id, a.title, a.topic, a.author, a.body, a.created_at, a.votes, a.article_img_url, CAST(COUNT(a.article_id) AS INTEGER) AS comment_count
        FROM articles a
        JOIN comments c
            ON a.article_id = c.article_id
        WHERE a.article_id = $1
        GROUP BY a.article_id;`, [id])

    .then((results) =>{
        if (results.rowCount === 0) {
            return this.articleExists(id)
            .then((exists) => {
                if (exists) {
                    // valid article with no comments
                    return [];
                }
                else {
                    // invalid article
                    return Promise.reject({status: 404, msg: 'Not found'});
                }
            });
        }

        // format created_at date
        let article = results.rows[0];
        const createdAt = moment(new Date(article.created_at)).format('YYYY-MM-DD HH:mm:ss');
        article.created_at = createdAt
        return article;
    })
    .catch((err) => {
        next(err);
    });
});

exports.articleExists = ((id, next) => {
    return db.query(`SELECT article_id
        FROM articles a
        WHERE article_id = $1;`, [id])

    .then(({rows}) =>{
        if (rows.length > 0) {
            return true;
        }
        else {
            return false;
        }
    })
    .catch((err) => {
        next(err);
    });
});

exports.getArticlesQuery = ((next, sort_by, order, topic = '') => {

    let queryStr = `
        SELECT a.article_id, a.title, a.topic, a.author, a.created_at, a.votes, a.article_img_url, CAST(COUNT(a.article_id) AS INTEGER) AS comment_count
            FROM articles a
            JOIN comments c
                ON a.article_id = c.article_id`;

    if (topic) {
        queryStr += ` WHERE a.topic = '${topic}'`;
    }

    queryStr += ` GROUP BY a.article_id
        ORDER BY ${sort_by} ${order};`;

    return db.query(queryStr)
        .then(({rows}) =>{
            if (rows.length === 0) {
                return Promise.reject({status: 404, msg: 'Not found'});
            };
            return rows;
        })
        .catch((err) => {
            next(err);
        });
});

exports.patchArticleQuery = ((id, inc_votes, next) => {
    return db.query(
        `UPDATE articles
            SET votes = (
                CASE
                    WHEN votes + $1 < 0 THEN 0
                    ELSE votes + $1
                END
            )
            WHERE article_id = $2
            RETURNING *;`, [inc_votes, id])

    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Not found'});
        }
        
        // format date
        rows[0].created_at = moment(new Date(rows[0].created_at)).format('YYYY-MM-DD HH:mm:ss');
        return rows[0];
    })
    .catch((err) => {
        next(err);
    });
});

exports.postArticleQuery = (article, next) => {
    return db.query(
        `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url)
        VALUEs ($1, $2, $3, $4, NOW(), 0, $5)
        RETURNING *;`, [article.title, article.topic, article.author, article. body, article.article_img_url])

    .then(({rows}) => {
        return rows[0];
    })
    
    .catch((err) =>{
        if (err.detail 
            && (err.detail.includes('is not present in table "users"') 
            || err.detail.includes('is not present in table "topics"'))) {
            return Promise.reject({status: 400, msg: 'Bad request'});
        };
        next(err);
    });
};



