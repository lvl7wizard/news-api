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
                expect(body.msg).toBe("Not Found - endpoint does not exist")
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
        test("responds with an error when passed a valid article_id number but no articles exist with that id", () => {
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
                expect(body.msg).toEqual("Bad Request - parametric endpoint must be a number")
            })    
        })
        test("returned object should have a comment_count property which is the total count of all the comments with this article_id", () => {
            return db.query('SELECT * FROM comments WHERE article_id = 1').then((comments) => {
                return request(app).get('/api/articles/1')
                .expect(200)
                .then(({body}) => {
                        numberOfComments = comments.rows.length
                        expect(body.article).toEqual(expect.objectContaining({
                          comment_count: numberOfComments
                        }))
                })
            })
        })
        test("comment_count should be 0 if the article has no comments", () => {
            return db.query('SELECT * FROM comments WHERE article_id = 2').then((comments) => {
                return request(app).get('/api/articles/2')
                .expect(200)
                .then(({body}) => {
                        numberOfComments = comments.rows.length
                        expect(body.article).toEqual(expect.objectContaining({
                          comment_count: numberOfComments
                        }))
                })
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
    describe("GET /api/articles?sort_by=:sort_by", () => {
        test("returned items can be sorted by title (defaults to descending)", () => {
            return request(app).get('/api/articles?sort_by=title')
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
                expect(body.articles).toBeSortedBy('title', {descending: "true"}) 
            })
        })
        test("defaults to be sorted by created_at (default descending)", () => {
            return request(app).get('/api/articles')
            .expect(200)
            .then(({body}) => {
                expect(body.articles).toBeSortedBy('created_at', {descending: "true"})
            })
        })
        test("can be sorted by author (default descending)", () => {
            return request(app).get('/api/articles?sort_by=author')
            .expect(200)
            .then(({body}) => {
                expect(body.articles).toBeSortedBy('author', {descending: "true"})
            })
        })
        test("can be sorted by votes (default descending)", () => {
            return request(app).get('/api/articles?sort_by=votes')
            .expect(200)
            .then(({body}) => {
                expect(body.articles).toBeSortedBy('votes', {descending: "true"})
            })
        })
        test("400 - cannot be sorted by a property that is not listed in the model's green list (SQL injection protection)", () => {
            return request(app).get('/api/articles?sort_by=potatoes')
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toEqual("Bad Request - invalid sort_by query value")
            })
        }) 
    })
    describe("GET /api/articles?order=:order", () => {
        test("order query can be set to set to ascending", () => {
            return request(app).get('/api/articles?order=asc')
            .expect(200)
            .then(({body}) => {
                expect(body.articles).toBeSortedBy('created_at', {ascending: "true"})
            })
        })
        test("order query can be set to set to descending", () => {
            return request(app).get('/api/articles?order=desc')
            .expect(200)
            .then(({body}) => {
                expect(body.articles).toBeSortedBy('created_at', {descending: "true"})
            })
        })
        test("400 - order query must be either asc or desc (SQL injection protection)", () => {
            return request(app).get('/api/articles?order=potatoes')
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toEqual("Bad Request - invalid order query")
            })
        })
        test("order query (asc) can be combined with a sort_by query", () => {
            return request(app).get('/api/articles?sort_by=topic&order=asc')
            .expect(200)
            .then(({body}) => {
                expect(body.articles).toBeSortedBy('topic', {ascending: "true"})
            })
        })
        test("order query (desc) can be combined with a sort_by query", () => {
            return request(app).get('/api/articles?sort_by=title&order=desc')
            .expect(200)
            .then(({body}) => {
                expect(body.articles).toBeSortedBy('title', {descending: "true"})
            })
        })
    })

    describe("GET /api/articles?topic=:topic", () => {
        test("filters articles by the topic value specified in the query", () => {
            return request(app).get('/api/articles?topic=cats')
            .expect(200)
            .then(({body}) => {
                expect(body.articles.length).toBe(1)
            })
        })
        test("404 - responds with an error when passed a topic that doesn't exist", () => {
            return request(app).get('/api/articles?topic=potatoes')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toEqual("Not Found - topic does not exist")
            })
        })
        test("responds with an empty array when passed a topic that does exist but no comments exist for it", () => {
            return request(app).get('/api/articles?topic=paper')
            .expect(200)
            .then(({body}) => {
                expect(body.articles).toEqual([])
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
                expect(body.msg).toEqual("Bad Request - parametric endpoint must be a number")
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
    describe("POST /api/articles/:article_id/comments", () => {
        test("responds with the posted comment", () => {
            return request(app).post('/api/articles/2/comments')
            .send({
                username: "butter_bridge",
                body: "Test comment"
            })
            .expect(201)
            .then(({body}) => {
                expect(body.comment).toEqual(expect.objectContaining({
                    comment_id: expect.any(Number),
                    votes: 0,
                    created_at: expect.any(String),
                    author: "butter_bridge",
                    body: "Test comment",
                    article_id: 2
                }))
            })
        })
        test("400 - responds with error when an invalid username is given", () => {
            return request(app).post('/api/articles/2/comments')
            .send({ 
                username: "lvl7wizard",
                body: "A load of hocus pocus"
            })
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toEqual("Bad Request - user does not exist")
            })
        })
        test("404 - responds with an error when passed an article_id that does not exist", () => {
            return request(app).post('/api/articles/7777/comments')
            .send({ 
                username: "butter_bridge",
                body: "Test comment"
            })
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toEqual("Not Found - article_id does not exist")
            })
        })
        test("400 - responds with an error when passed an invalid article_id", () => {
            return request(app).post('/api/articles/notanumber/comments')
            .send({ 
                username: "butter_bridge",
                body: "Test comment"
            })
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toEqual("Bad Request - parametric endpoint must be a number")
            })
        })
        test("400 - responds with error when a request body with invalid keys is given", () => {
            return request(app).post('/api/articles/2/comments')
            .send({ 
                body: "Test comment"
            })
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toEqual("Bad Request - body must contain valid username and body keys")
            })
        })
    })
    describe("PATCH /api/articles/:article_id", () => {
        test("responds with the updated article", async () => {
           return db.query('SELECT * FROM articles WHERE article_id = 1').then(({rows}) => {
                return rows[0].votes
            })
            .then((originalVotes) => {
                return request(app).patch('/api/articles/1')
                .send({ 
                    inc_votes : 100
                })
                .expect(200)
                .then(({body}) => {
                    expect(body.article).toEqual(expect.objectContaining({
                            author: 'butter_bridge',
                            title : 'Living in the shadow of a great man',
                            article_id : 1,
                            body : 'I find this existence challenging',
                            topic : 'mitch',
                            created_at : expect.any(String),
                            votes: originalVotes + 100,
                            article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
                    }))
                })



            })
        })
        test("404 - responds with an error if article_id does not exist", () => {
            return request(app).patch('/api/articles/7777')
            .send({ 
                inc_votes : 1
            })
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toEqual("Not Found - article_id does not exist")
            })
        })
        test("400 - responds with an error when passed an invalid article_id", () => {
            return request(app).patch('/api/articles/notanumber')
            .send({ 
                inc_votes : 1
            })
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toEqual("Bad Request - parametric endpoint must be a number")
            })
        })
        test("400 - responds with an error when a request body with invalid keys is given", () => {
            return request(app).patch('/api/articles/1')
            .send({
                key: "something's wrong"
            })
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toEqual("Bad Request - body must contain a valid inc_votes key")
            })
        })
    })
    describe("DELETE /api/comments/:comment_id", () => {
        test("responds with status 204 and no content", () => {
            return request(app).delete('/api/comments/1')
            .expect(204)
            .then(({body}) => {
                expect(body).toEqual({})
            })
        })
        test("comment is removed from database, all other comments are NOT deleted", () => {
            return request(app).delete('/api/comments/1')
            .expect(204)
            .then(() => {
                return db.query('SELECT * FROM comments WHERE comment_id = 1')
                .then(({rows}) => {
                    expect(rows.length).toBe(0)
                })
                .then(() => {
                    return db.query('SELECT * FROM comments')
                    .then(({rows}) => {
                        expect(rows.length).toBe(17)
                    })
                })
            })
        })
        test("404 - responds with an error if no comments with a matching comment_id are found", () => {
            return request(app).delete('/api/comments/7777')
            .expect(404)
            .then(({body}) => {
                expect(body.msg).toEqual("Not Found - no comments with that comment_id exist")
            })
        })
        test("400 - responds with an error if passed an invalid comment_id i.e not a number", () => {
            return request(app).delete('/api/comments/notanumber')
            .expect(400)
            .then(({body}) => {
                expect(body.msg).toEqual("Bad Request - parametric endpoint must be a number")
            })
        })
    })
    describe("GET /api/users", () => {
        test("responds with an array of objects. each object should have a username, name, and avatar url property", () => {
            return request(app).get('/api/users')
            .expect(200)
            .then(({body}) => {
                expect(body.users.length).toEqual(4)
                body.users.forEach((user) => {
                    expect(user).toEqual(expect.objectContaining({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String)
                    }))
                })
            })
        })
    })
})