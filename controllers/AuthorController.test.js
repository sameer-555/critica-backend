const  request = require('supertest')
const {app} = require('../index')

describe("GET/authors", () => {
    describe("get authors from firebase", () => {

        test('should respond back authors list', async() => {
            const response = await request(app).get("/api/authors").send()
            expect(response.statusCode).toBe(200)
        })
    })
} )