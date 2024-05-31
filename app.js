const db = require('./db/connection');
const express = require('express');
const {getTopics} = require('./controllers/topic-controller');
const {getApiData} = require('./controllers/core-api-controller');
const {getArticles, getArticleById, patchArticle, postArticle} = require('./controllers/article-controller');
const {getCommentsByArticle, postComment, deleteComment, patchComment} = require('./controllers/comment-controller');
const {getUsers, getUser} = require('./controllers/user-controller');

const app = express();
app.use(express.json());

app.get('/api', getApiData);
app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:id', getArticleById);
app.get('/api/articles/:id/comments', getCommentsByArticle);
app.get('/api/users', getUsers);
app.get('/api/users/user', getUser);

app.post('/api/articles/:id/comments', postComment);
app.post('/api/articles', postArticle);

app.patch('/api/articles/:id', patchArticle);
app.patch('/api/comments/:id', patchComment);

app.delete('/api/comments/:id', deleteComment);

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
    res.status(500).send({ msg: 'Internal server error'});
});

module.exports = app;