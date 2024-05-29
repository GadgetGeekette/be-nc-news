const db = require('../db/connection');
const request = require('supertest');
const testData = require('../db/data/test-data');
const seed = require('../db/seeds/seed');
const app = require('../app');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe.only('Get article by ID', () => {
    it.only('Returns correct article', () => {
        return request(app)
            .get('/api/articles/3')
            .expect(200)
            .then(({body}) => {
                expect(body.article).toEqual({
                    article_id: 3,
                    title: 'Eight pug gifs that remind me of mitch',
                    topic: 'mitch',
                    author: 'icellusedkars',
                    body: 'some gifs',
                    created_at: '2020-11-03 09:12:00',
                    votes: 0,
                    article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
                });
            });
    });
    it('Returns 404 not found for a non existent but valid article ID', () => {
        return request(app)
            .get('/api/articles/333')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toEqual('Not found');
            });
    });
    it('Returns 400 bad request for an invalid article ID', () => {
        return request(app)
            .get('/api/articles/choccie')
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toEqual('Bad request');
            });
    });
});

