const endpoints = require('../endpoints.json');

exports.getApiDataQuery = (next) => {
    return endpoints;
};