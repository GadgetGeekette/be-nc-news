const db = require('../db/connection');
const request = require('supertest');
const testData = require('../db/data/test-data');
const seed = require('../db/seeds/seed');
const app = require('../app');
const fs = require('fs/promises');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('Get core API', () => {
    it('Returns descriptions of all endpoints', () => {
        return fs.readFile('endpoints.json', 'utf-8')
            .then((fileData) => {
                return request(app)
                    .get('/api')
                    .expect(200)
                    .then(({body}) => {
                        expect(body.msg).toEqual(fileData);
                    });
            });
    });
})