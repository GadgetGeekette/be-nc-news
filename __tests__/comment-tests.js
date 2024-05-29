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
