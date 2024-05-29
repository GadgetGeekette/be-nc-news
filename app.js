const db = require('./db/connection');
const express = require('express');
const {getTopics} = require('./controllers/topic-controller');
const {getApiData} = require('./controllers/core-api-controller');
const {getArticleById} = require('./controllers/article-controller');

const app = express();
app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api', getApiData);
app.get('/api/articles/:id', getArticleById);

// psql error
app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({msg: 'Bad request'})
    }
    else {
        next(err);
    }
})

// custom error
app.use((err, req, res, next) => {
    if (err.status && err.msg){
        res.status(err.status).send({msg: err.msg});
    }
    else {
        next(err);
    }
});

// default error
app.use((err, req, res, next) => {
    res.status(500).send({ msg: 'Unknown error occurred'});
});

module.exports = app;
