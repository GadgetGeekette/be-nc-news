const db = require('../db/connection');

exports.getTopicsQuery = (req, res, next) => {
    return db.query('SELECT * FROM topics')
        .then(({rows}) => {
            return rows;
        });
};
