const db = require('../db/connection');
const request = require('supertest');
const testData = require('../db/data/test-data');
const seed = require('../db/seeds/seed');
const app = require('../app');
const e = require('express');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('Get topics', () => {
    it('Returns correct number of topics', () => {
        return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({body}) => {
                expect(body).toHaveLength(3);
            });
    })
    it('Returns topics in correct format', () => {
        return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({body}) => {
                expect(body).toHaveLength(3);
                body.forEach((topic) => {
                    expect(topic).toMatchObject(
                        {
                            slug: expect.any(String),
                            description: expect.any(String)
                        }
                    );
                });
            });
    })
})