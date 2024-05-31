const db = require('../db/connection');
const request = require('supertest');
const testData = require('../db/data/test-data');
const seed = require('../db/seeds/seed');
const app = require('../app');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('Get users', () => {
    it('Returns all users in the correct format', () => {
        return request(app)
            .get('/api/users')
            .expect(200)
            .then(({body}) => {
                expect(body.users).toHaveLength(4);
                body.users.forEach((user) => {
                    expect(user).toMatchObject({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                });
            });
        });
    });
});

describe('Get user', () => {
    it('Returns correct user', () => {
        return request(app)
            .get('/api/users/user')
            .send({username: 'rogersop'})
            .expect(200)
            .then(({body}) => {
                expect(body.user).toEqual({
                    username: 'rogersop',
                    name: 'paul',
                    avatar_url: 'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4'
                });
            });
    });
    it('Returns 404 not found for a non existent but valid username', () => {
        return request(app)
            .get('/api/users/user')
            .send({username: 'sofia'})
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toEqual('Not found');
            });
    });
    it('Returns 400 bad request for an invalid username', () => {
        return request(app)
            .get('/api/users/user')
            .send({username: 5})
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toEqual('Bad request');
            });
    });
    it('Returns 400 bad request for a missing username', () => {
        return request(app)
            .get('/api/users/user')
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toEqual('Bad request');
            });
    });
});
