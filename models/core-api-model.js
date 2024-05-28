const fs = require('fs/promises');
const { slice } = require('../db/data/test-data/articles');

exports.getApiDataQuery = (next) => {
    return fs.readFile('endpoints.json', 'utf-8')
        .then((fileData) => {
            return fileData
        })
        .catch((err) => {
            console.log('model err--->', err);
            next(err);
        });;
};