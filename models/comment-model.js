const db = require('../db/connection');
const moment = require('moment');

exports.getCommentsByArticleQuery = ((id, next) => {
    return db.query(
        `SELECT comment_id, votes, created_at, author, body, article_id
        FROM comments c
        WHERE article_id = $1
        ORDER BY created_at DESC;`, [id])
        
        .then(({rows}) => {
            rows.map((comment) => {
                comment.created_at = moment(new Date(comment.created_at)).format('YYYY-MM-DD HH:mm:ss');
            });
            return rows;
        })
        .catch((err) => {
            next(err);
        });
});

exports.postCommentQuery = (body, id, username, next) => {
    return db.query(
        `INSERT INTO comments (body, article_id, author, votes, created_at)
        SELECT $1, $2, $3, 0, NOW()
        RETURNING *;`, [body, Number(id), username])

    .then(({rows}) => {
        return rows[0];
    })
    
    .catch((err) =>{
        if (err.detail && err.detail.includes('is not present in table "articles"')) {
            return Promise.reject({status: 404, msg: 'Not found'});
        }
        else if (err.detail && err.detail.includes('is not present in table "users"')) {
            return Promise.reject({status: 400, msg: 'Bad request'});
        };
        next(err);
    });
};

exports.deleteCommentQuery = (id, next) => {
    return db.query(
        `DELETE FROM comments
        WHERE comment_id = $1
        RETURNING *;`, [Number(id)])

    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Not found'});
        }
        return rows[0];
    })
    
    .catch((err) =>{
        next(err);
    });
};

exports.patchCommentQuery = ((id, inc_votes, next) => {
    return db.query(
        `UPDATE comments
            SET votes = (
                CASE
                    WHEN votes + $1 < 0 THEN 0
                    ELSE votes + $1
                END
            )
            WHERE comment_id = $2
            RETURNING *;`, [inc_votes, id])

    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Not found'});
        }
        return rows[0];
    })
    .catch((err) => {
        next(err);
    });
});

