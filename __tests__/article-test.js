const db = require('../db/connection');
const request = require('supertest');
const testData = require('../db/data/test-data');
const seed = require('../db/seeds/seed');
const app = require('../app');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('Get article by ID', () => {
    it('Returns correct article', () => {
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

describe('Get articles', () => {
    it('Returns correct number of articles', () => {
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body}) => {
                expect(body.articles).toHaveLength(5);
            });
    });
    it('Returns articles in the correct format', () => {
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body}) => {
                body.articles.forEach((article) => {
                    expect(article).toMatchObject({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        comment_count: expect.any(Number)
                    })
                });
            });
    });
    it('Returns articles in date descending order', () => {
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body}) => {
                expect(body.articles).toBeSortedBy('created_at', {descending: true});
            });
    });
});

