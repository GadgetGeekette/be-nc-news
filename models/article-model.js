const db = require('../db/connection');
const moment = require('moment');

exports.getArticleByIdQuery = ((id, next) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then((results) =>{
        if (results.rowCount === 0) {
            return Promise.reject({status: 404, msg: 'Not found'});
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

exports.getArticlesQuery = ((next, topic='') => {
    if (topic) {
        // articles filtered by topic
        return db.query(`SELECT a.article_id, a.title, a.topic, a.author, a.created_at, a.votes, a.article_img_url, count(c.article_id) as comment_count
        FROM articles a
        JOIN comments c
            ON a.article_id = c.article_id
        WHERE a.topic = $1
        GROUP BY a.article_id
        ORDER BY a.created_at DESC;`, [topic])

        .then(({rows}) =>{
            rows.map((row) => {
                row.comment_count = Number(row.comment_count);
            })
            return rows;
        })
        .catch((err) => {
            next(err);
        });
    }
    else {
        // articles not filtered by topic
        return db.query(`SELECT a.article_id, a.title, a.topic, a.author, a.    created_at, a.votes, a.article_img_url, count(c.article_id) as comment_count
        FROM articles a
        JOIN comments c
            ON a.article_id = c.article_id
        GROUP BY a.article_id
        ORDER BY a.created_at DESC;`)

        .then(({rows}) =>{
            rows.map((row) => {
                row.comment_count = Number(row.comment_count);
            })
            return rows;
        })
        .catch((err) => {
            next(err);
        });
    };
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


