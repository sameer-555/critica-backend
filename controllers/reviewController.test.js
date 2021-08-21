const  request = require('supertest')
const {app} = require('../index')


describe("POST/review", () => {
    describe("add review to a book by test user", () => {

        test('should respond genres list', async() => {
            const response = await request(app).post("/api/review").send({
                userID:"0MaQlgiDqzwo1XOdluyG",
                rating:4,
                comment:"Testing",
                bookID: "Testing"
            })
            expect(response.statusCode).toBe(400)
            
        })
    })
} )