const db = require('../db/connection');
const request = require('supertest');
const testData = require('../db/data/test-data');
const seed = require('../db/seeds/seed');
const app = require('../app');
const {articleExists} = require('../models/article-model')

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
                    article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                    comment_count: 2
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
    it('Returns correct number of articles in the correct format', () => {
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body}) => {
                expect(body.articles).toHaveLength(5);
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

describe('Patch article', () => {
    it("Correctly increments an article's votes", () => {
        const updateData = { inc_votes: 10 };
        return request(app)
            .patch('/api/articles/3')
            .send(updateData)
            .expect(200)
            .then(({body}) => {
                expect(body.article).toEqual({
                    article_id: 3,
                    title: 'Eight pug gifs that remind me of mitch',
                    topic: 'mitch',
                    author: 'icellusedkars',
                    body: 'some gifs',
                    created_at: '2020-11-03 09:12:00',
                    votes: 10,
                    article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
                });
            });
    });
    it("Correctly decreases an article's votes", () => {
        const updateData = { inc_votes: -5 };
        return request(app)
            .patch('/api/articles/1')
            .send(updateData)
            .expect(200)
            .then(({body}) => {
                expect(body.article).toEqual({
                    article_id: 1,
                    title: 'Living in the shadow of a great man',
                    topic: 'mitch',
                    author: 'butter_bridge',
                    body: 'I find this existence challenging',
                    created_at: '2020-07-09 21:11:00',
                    votes: 95,
                    article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
                });
            });
    });
    it("Doesn't decrease an article's votes below zero", () => {
        const updateData = { inc_votes: -500 };
        return request(app)
            .patch('/api/articles/1')
            .send(updateData)
            .expect(200)
            .then(({body}) => {
                expect(body.article).toEqual({
                    article_id: 1,
                    title: 'Living in the shadow of a great man',
                    topic: 'mitch',
                    author: 'butter_bridge',
                    body: 'I find this existence challenging',
                    created_at: '2020-07-09 21:11:00',
                    votes: 0,
                    article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
                });
            });
    });
    it('Returns 404 not found for a non existent but valid article ID', () => {
        const updateData = { inc_votes: 12 };
        return request(app)
            .patch('/api/articles/999')
            .send(updateData)
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toEqual('Not found');
            });
    });
    it('Returns 400 bad request for an invalid article ID', () => {
        const updateData = { inc_votes: 7 };
        return request(app)
            .patch('/api/articles/cabbage')
            .send(updateData)
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toEqual('Bad request');
            });
    });
});

describe('Get articles by topic', () => {
    it('Returns all articles when empty topic is passed', () => {
        const topic = {topic: ''};
        return request(app)
            .get('/api/articles')
            .send(topic)
            .expect(200)
            .then(({body}) => {
                expect(body.articles).toHaveLength(5);
            });
    });
    it('Returns the correct number of articles when topic is passed', () => {
        const topic = {topic: 'mitch'};
        return request(app)
            .get('/api/articles')
            .send(topic)
            .expect(200)
            .then(({body}) => {
                expect(body.articles).toHaveLength(4);
            });
    });
    it('Returns 404 not found for a non existent but valid topic', () => {
        const topic = {topic: 'blue-skies'};
        return request(app)
            .get('/api/articles')
            .send(topic)
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toEqual('Not found');
            });
    });
    it('Returns 400 bad request for an invalid topic', () => {
        const topic = {topic: 999};
        return request(app)
            .get('/api/articles')
            .send(topic)
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toEqual('Bad request');
            });
    });
});


