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
