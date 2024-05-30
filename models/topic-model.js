const db = require('../db/connection');

exports.getTopicsQuery = (next) => {
    return db.query('SELECT * FROM topics')
        .then(({rows}) => {
            return rows;
        })
        .catch((err) => {
            next(err);
        });
};

exports.getTopic = (slug, next) => {
    return db.query(
        `SELECT * FROM topics
            WHERE slug = $1`, [slug])
        .then(({rows}) => {
            if (rows.length === 0) {
                return Promise.reject({status: 404, msg: 'Not found'});
            }
            return rows[0];
        })
        .catch((err) => {
            next(err);
        });
};
