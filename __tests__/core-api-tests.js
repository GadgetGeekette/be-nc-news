
const db = require('../db/connection');
const testData = require('../db/data/test-data');
const seed = require('../db/seeds/seed');
const request = require('supertest');
const app = require('../app');
const endpoints = require('../endpoints.json');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('Get core API', () => {
    it('Returns descriptions of all endpoints', () => {
        return request(app)
            .get('/api')
            .expect(200)
            .then(({body}) => {
                expect(body.msg).toEqual(endpoints);
            });
    });
})