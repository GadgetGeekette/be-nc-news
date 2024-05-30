const db = require('./db/connection');
const express = require('express');
const {getTopics} = require('./controllers/topic-controller');
const {getApiData} = require('./controllers/core-api-controller');
const {getArticles, getArticleById} = require('./controllers/article-controller');
const {getCommentsByArticle, postComment} = require('./controllers/comment-controller');

const app = express();
app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api', getApiData);
app.get('/api/articles', getArticles);
app.get('/api/articles/:id', getArticleById);
app.get('/api/articles/:id/comments', getCommentsByArticle);

app.post('/api/articles/:id/comments', postComment);

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
    //if (err.status){
        res.status(err.status).send({msg: err.msg});
    }
    else {
        next(err);
    }
});

// default error
app.use((err, req, res, next) => {
    res.status(500).send({ msg: 'Internal server error'});
});

module.exports = app;