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
        if (err.detail.includes('is not present in table "users"')) {
            return Promise.reject({status: 400, msg: 'Bad request'});
        };
        next(err);
    });
};