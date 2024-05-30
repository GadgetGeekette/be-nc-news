const db = require('../db/connection');
const request = require('supertest');
const testData = require('../db/data/test-data');
const seed = require('../db/seeds/seed');
const app = require('../app');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('Get article comments', () => {
    it('Returns correct article comments', () => {
        return request(app)
            .get('/api/articles/6/comments')
            .expect(200)
            .then(({body}) => {
                expect(body.comments).toEqual([{
                    comment_id: 16,
                    votes: 1,
                    created_at: '2020-10-11 16:23:00',
                    author: 'butter_bridge',
                    body: 'This is a bad article name',
                    article_id: 6
                }]);
            });
    });
    it('Returns 400 bad request for invalid ID', () => {
        return request(app)
            .get('/api/articles/chipsticks/comments')
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toEqual('Bad request');
            });
    });
    it('Returns 404 not found for valid but non existent ID', () => {
        return request(app)
            .get('/api/articles/777/comments')
            //.expect(404)
            .then(({body}) => {
                expect(body.msg).toEqual('Not found');
            });
    });
    it('Returns 200 empty array for an existing article with no comments', () => {
        return request(app)
            .get('/api/articles/2/comments')
            .expect(200)
            .then(({body}) => {
                expect(body.comments).toEqual([]);
            });
    });
    it('Returns comments in date descending order', () => {
        return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({body}) => {
                expect(body.comments).toBeSortedBy('created_at', {descending: true});
            });
    });
});

describe.only('Post comments', () => {
    it('Correctly adds a comment', () => {
        const comment = {
            username: 'icellusedkars',
            body: 'Oh promise all - my favourite!'
        }
        return request(app)
            .post('/api/articles/7/comments')
            .send(comment)
            .expect(201)
            .then(({body}) => {
                expect(body.comment).toEqual({
                    comment_id: 19,
                    votes: 0,
                    created_at: expect.any(String),
                    author: 'icellusedkars',
                    body: 'Oh promise all - my favourite!',
                    article_id: 7
                });
            });
    });
    it('Returns 400 bad request when missing comment data', () => {
        const comment = {
            username: 'icellusedkars'
        }
        return request(app)
            .post('/api/articles/7/comments')
            .send(comment)
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('Bad request');
            });
    });
    it('Returns 404 not found for a non existent but valid article ID', () => {
        const comment = {
            username: 'icellusedkars',
            body: 'Oh promise all - my favourite!'
        }
        return request(app)
            .post('/api/articles/777/comments')
            .send(comment)
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toEqual('Not found');
            });
    });
    it('Returns 400 bad request for an invalid article ID', () => {
        const comment = {
            username: 'icellusedkars',
            body: 'Oh promise all - my favourite!'
        }
        return request(app)
            .post('/api/articles/floof/comments')
            .send(comment)
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toEqual('Bad request');
            });
    });
    it.only('Returns 400 bad request for an invalid author', () => {
        const comment = {
            username: 'buster-move',
            body: 'Oh promise all - my favourite!'
        }
        return request(app)
            .post('/api/articles/7/comments')
            .send(comment)
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toEqual('Bad request');
            });
    });
});