const db = require('../db/connection');

exports.getUsersQuery = ((next) => {
    return db.query(`SELECT * FROM users`)
    .then(({rows}) =>{
        return rows;
    })
    .catch((err) => {
        next(err);
    });
});

exports.getUserQuery = ((username, next) => {
    return db.query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({rows}) =>{
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Not found'});
        }
        return rows[0];
    })
    .catch((err) => {
        next(err);
    });
});