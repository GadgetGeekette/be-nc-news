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
    it('Returns articles in date descending order when no sort_by and no order passed', () => {
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body}) => {
                expect(body.articles).toBeSortedBy('created_at', {descending: true});
            });
    });
    it('Returns articles sorted by specified column in descending order when no order passed', () => {
        return request(app)
            .get('/api/articles?sort_by=author')
            .expect(200)
            .then(({body}) => {
                expect(body.articles).toBeSortedBy('author', {descending: true});
            });
    });
    it('Returns articles sorted by specified column in the specified order', () => {
        return request(app)
            .get('/api/articles?sort_by=title&order=asc')
            .expect(200)
            .then(({body}) => {
                expect(body.articles).toBeSortedBy('title', {ascending: true});
            });
    });
    it('Returns articles sorted by date in the specified order when no sort_by passed', () => {
        return request(app)
            .get('/api/articles?order=asc')
            .expect(200)
            .then(({body}) => {
                expect(body.articles).toBeSortedBy('created_at', {ascending: true});
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
        return request(app)
            .get('/api/articles?topic=mitch')
            .expect(200)
            .then(({body}) => {
                expect(body.articles).toHaveLength(4);
            });
    });
    it('Returns 404 not found for an invalid/non-existent topic', () => {
        return request(app)
            .get('/api/articles?topic=999')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toEqual('Not found');
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

describe('Post article', () => {
    it('Correctly adds an article', () => {
        const article = {
            author: 'icellusedkars',
            title: 'Floof faced fellas are all the rage',
            body: 'Beards are in, clean shaven is out!',
            topic: 'mitch',
            article_img_url: 'https://images.pexels.com/photos/897262/pexels-photo-897262.jpeg'
        }
        return request(app)
            .post('/api/articles')
            .send(article)
            .expect(201)
            .then(({body}) => {
                expect(body.article).toEqual({
                    article_id: 14,
                    title: 'Floof faced fellas are all the rage',
                    topic: 'mitch',
                    author: 'icellusedkars',
                    body: 'Beards are in, clean shaven is out!',
                    created_at: expect.any(String),
                    votes: 0,
                    article_img_url: 'https://images.pexels.com/photos/897262/pexels-photo-897262.jpeg',
                    comment_count: 0
                });
            });
    });
    it('Returns 400 bad request when missing article data', () => {
        return request(app)
            .post('/api/articles')
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('Bad request');
            });
    });
    it('Returns 400 bad request when empty article passed', () => {
        return request(app)
            .post('/api/articles')
            .send({})
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('Bad request');
            });
    });
    it('Returns 400 bad request when empty article missing author is passed', () => {
        const article = {
            title: 'Floof faced fellas are all the rage',
            body: 'Beards are in, clean shaven is out!',
            topic: 'mitch',
            article_img_url: 'https://images.pexels.com/photos/897262/pexels-photo-897262.jpeg'
        }
        return request(app)
            .post('/api/articles')
            .send(article)
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('Bad request');
            });
    });
    it('Returns 400 bad request when empty article missing title is passed', () => {
        const article = {
            author: 'icellusedkars',
            body: 'Beards are in, clean shaven is out!',
            topic: 'mitch',
            article_img_url: 'https://images.pexels.com/photos/897262/pexels-photo-897262.jpeg'
        }
        return request(app)
            .post('/api/articles')
            .send(article)
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('Bad request');
            });
    });
    it('Returns 400 bad request when empty article missing body is passed', () => {
        const article = {
            author: 'icellusedkars',
            title: 'Floof faced fellas are all the rage',
            topic: 'mitch',
            article_img_url: 'https://images.pexels.com/photos/897262/pexels-photo-897262.jpeg'
        }
        return request(app)
            .post('/api/articles')
            .send(article)
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('Bad request');
            });
    });
    it('Returns 400 bad request when empty article missing topic is passed', () => {
        const article = {
            author: 'icellusedkars',
            title: 'Floof faced fellas are all the rage',
            body: 'Beards are in, clean shaven is out!',
            article_img_url: 'https://images.pexels.com/photos/897262/pexels-photo-897262.jpeg'
        }
        return request(app)
            .post('/api/articles')
            .send(article)
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('Bad request');
            });
    });
    it('Returns 400 bad request when empty article missing article_img_url is passed', () => {
        const article = {
            author: 'icellusedkars',
            title: 'Floof faced fellas are all the rage',
            body: 'Beards are in, clean shaven is out!',
            topic: 'mitch'
        }
        return request(app)
            .post('/api/articles')
            .send(article)
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toBe('Bad request');
            });
    });
    it('Returns 400 bad request for an invalid author', () => {
        const article = {
            author: 'scottish-charm',
            title: 'Floof faced fellas are all the rage',
            body: 'Beards are in, clean shaven is out!',
            topic: 'mitch',
            article_img_url: 'https://images.pexels.com/photos/897262/pexels-photo-897262.jpeg'
        }
        return request(app)
            .post('/api/articles')
            .send(article)
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toEqual('Bad request');
            });
    });
    it('Returns 400 bad request for an invalid topic', () => {
        const article = {
            author: 'icellusedkars',
            title: 'Floof faced fellas are all the rage',
            body: 'Beards are in, clean shaven is out!',
            topic: 'honey bees',
            article_img_url: 'https://images.pexels.com/photos/897262/pexels-photo-897262.jpeg'
        }
        return request(app)
            .post('/api/articles')
            .send(article)
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toEqual('Bad request');
            });
    });
});



