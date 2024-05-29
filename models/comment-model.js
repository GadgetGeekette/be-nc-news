const db = require('../db/connection');
const moment = require('moment');

exports.getCommentsByArticleQuery = ((id, next) => {
    return db.query(
        `SELECT comment_id, votes, created_at, author, body, article_id
        FROM comments c
        WHERE article_id = $1
        ORDER BY created_at DESC;`, [id])
        
        .then(({rows}) => {
            rows.map((article) => {
                article.created_at = moment(new Date(article.created_at)).format('YYYY-MM-DD HH:mm:ss');
            });
            return rows;
        })
        .catch((err) => {
            next(err);
        });    
});
