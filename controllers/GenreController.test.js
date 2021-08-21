const  request = require('supertest')
const {app} = require('../index')

describe("GET/genres", () => {
    describe("get genres from firebase", () => {

        test('should respond genres list', async() => {
            const response = await request(app).get("/api/genres").send()
            expect(response.statusCode).toBe(200)
        })
    })
} )