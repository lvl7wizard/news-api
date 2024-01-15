const app = require('../app');
const request = require('supertest');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');
const db = require('../db/connection');


beforeAll(() => seed(testData));
afterAll(() => {
   return db.end();
});

describe("app.js", () => {
    describe("GET /api/topics", () => {
        test("successful request responds with correct status code and an array of topic objects", () => {
            return request(app).get('/api/topics')
            .expect(200)
            .then(({body}) => {
                expect(Array.isArray(body.topics)).toBe(true)
            })
        })
        test("each object has a slug and description property", () => {
            return request(app).get('/api/topics')
            .expect(200)
            .then(({body}) => {
                console.log(body)
                body.topics.forEach((topic) => {
                    expect(topic).toEqual(expect.objectContaining({
                        slug: expect.any(String),
                        description : expect.any(String),
                    }))
                })
        })
    })
    })
})