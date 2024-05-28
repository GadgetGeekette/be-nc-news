const db = require('./db/connection');
const express = require('express');
const {getTopics} = require('./controllers/topic-controller');
const {getApiData} = require('./controllers/core-api-controller');

const app = express();
app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api', getApiData);

// default error
app.use((err, req, res, next) => {
    res.status(500).send({ msg: 'Unknown error occurred'});
});

module.exports = app;
