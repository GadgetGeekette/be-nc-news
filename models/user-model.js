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