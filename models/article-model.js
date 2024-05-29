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
})


