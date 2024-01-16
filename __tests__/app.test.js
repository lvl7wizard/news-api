const app = require('../app');
const db = require('../db/connection');
const request = require('supertest');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');
const endpoints = require('../endpoints.json')


beforeEach(() => seed(testData));
afterAll(() => {
   return db.end();
});

describe("app.js", () => {
    describe("GET /api/topics", () => {
        test("successful request responds with correct status code and an array containing the correct number of topic objects", () => {
            return request(app).get('/api/topics')
            .expect(200)
            .then(({body}) => {
                expect(Array.isArray(body.topics)).toBe(true)
                expect(body.topics).toHaveLength(3)
            })
        })
        test("each object has a slug and description property", () => {
            return request(app).get('/api/topics')
            .expect(200)
            .then(({body}) => {
                body.topics.forEach((topic) => {
                    expect(topic).toEqual(expect.objectContaining({
                        slug: expect.any(String),
                        description : expect.any(String),
                    }))
                })
            })
        })
        test("wrong paths return a 404 error", () => {
            return request(app).get('/api/wrongpath')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toBe("Bad Request - Endpoint does not exist")
            })
        })
    })
    
    describe("GET /api", () => {
        test("responds with an object describing all the available endpoints on the API", () => {
            return request(app).get('/api')
            .expect(200)
            .then(({body}) => {
                expect(body.endpoints).toEqual(expect.objectContaining(endpoints))
            })
        })
    })
    describe("GET /api/articles/:article_id", () => {
        test("responds with an object that has all the correct properties when a valid article_id is passed to the endpoint", () => {
            return request(app).get('/api/articles/1')
            .expect(200)
            .then(({body}) => {
                    expect(body.article).toEqual(expect.objectContaining({
                        author: expect.any(String),
                        title : expect.any(String),
                        article_id : 1,
                        body : expect.any(String),
                        topic : expect.any(String),
                        created_at : expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String)
                    }))
            })
        })
        test("404 - responds with an error when passed a valid article_id number but no articles exist with that id", () => {
            return request(app).get('/api/articles/7777')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toEqual("Not Found - There are no articles with that article_id number")
            })
        })
        test("400 - responds with an error when passed an invalid article_id number i.e. not a number", () => {
            return request(app).get('/api/articles/notanarticlenumber')
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toEqual("Bad Request - article_id must be a number")
            })
        })
    })
    describe("GET /api/articles", () => {
        test("responds with an array of all the articles", () => {
            return request(app).get('/api/articles')
            .expect(200)
            .then(({body}) => {
            expect(body.articles).toHaveLength(13)
            body.articles.forEach((article) => {
                expect(article).toEqual(expect.objectContaining({
                    author: expect.any(String),
                    title : expect.any(String),
                    article_id : expect.any(Number),
                    topic : expect.any(String),
                    created_at : expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(Number)
                }))    
            })
            })
        })
        test("articles should not have a body property", () => {
            return request(app).get('/api/articles')
            .expect(200)
            .then(({body}) => {
                body.articles.forEach((article) => {
                    expect(article).toEqual(expect.not.objectContaining({
                        body : expect.any(String)
                    }))
                })
            })
        })
        test("array should be sorted by date in descending order by default", () => {
            return request(app).get('/api/articles')
            .expect(200)
            .then(({body}) => {
                expect(body.articles).toBeSortedBy('created_at', {descending: true})
            })
        })
        test("each object should have a comment_count property which reflects the number of comments that have a matching article_id", () => {
            return request(app).get('/api/articles')
            .expect(200)
            .then(({body}) => {
                body.articles.forEach((article) => {
                    const matchingComments = testData.commentData.filter((comment) => {
                        return comment.article_id === article.article_id
                    })
                    expect(article.comment_count).toEqual(matchingComments.length)
                })
            })
        })
    })
    describe("GET /api/articles/:article_id/comments", () => {
        test("responds with an array of all comments that have a matching article_id", () => {
            return request(app).get('/api/articles/1/comments')
            .expect(200)
            .then(({body}) => {
                expect(Array.isArray(body.comments)).toBe(true)
                expect(body.comments.length).toBe(11)
            })
        })
        test("all comments should have the correct properties", () => {
            return request(app).get('/api/articles/1/comments')
            .expect(200)
            .then(({body}) => {
                body.comments.forEach((comment) => {
                    expect(comment).toEqual(expect.objectContaining({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        article_id: expect.any(Number)
                    }))
                })
            })
        })
        test("comments should be ordered with the most recent comments first by default", () => {
            return request(app).get('/api/articles/1/comments')
            .expect(200)
            .then(({body}) => {
                expect(body.comments).toBeSortedBy('created_at', {descending: true})
            })
        })
        test("400 - responds with an error when passed an invalid article_id number i.e. not a number", () => {
            return request(app).get('/api/articles/notanumber/comments')
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toEqual("Bad Request - article_id must be a number")
            })
        })
        test("404 - responds with an error when passed an article_id that does not exist", () => {
            return request(app).get('/api/articles/7777/comments')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toEqual("Not Found - article_id does not exist")
            })
        })
        test("responds with an empty array when passed an existing article_id that has no comments", () => {
            return request(app).get('/api/articles/2/comments')
            .expect(200)
            .then(({body}) => {
                expect(body.comments).toEqual([])
            })
        })
    })

})