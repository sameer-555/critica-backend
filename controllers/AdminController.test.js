const  request = require('supertest')
const {app} = require('../index')

describe("POST/adminresponse", () => {

    describe("given a userID and respose", () => {

        test('should respond with a 200 status code if respond is false', async () => {
            const response = await request(app).post("/api/adminresponse").send({
                userID:"0MaQlgiDqzwo1XOdluyG",
                respond:false
            })
            expect(response.statusCode).toBe(200)
        })

        test('should respond with a 200 status code if respond is true', async () => {
            const response = await request(app).post("/api/adminresponse").send({
                userID:"0MaQlgiDqzwo1XOdluyG",
                respond:true
            })
            expect(response.statusCode).toBe(200)
        })

    })

    describe("no user or no response in object" , () => {

        test('should respond with a 400 status code ', async () => {
            const bodyData = [
                { userID:"0MaQlgiDqzwo1XOdluyG"},
                { respond:false },
                { respond:true },
                {  }
            ]
            for(const body in bodyData){
                const response = await request(app).post("/api/adminresponse").send(body)
                expect(response.statusCode).toBe(400)
            }
        })
    } )
})


describe("GET/criticsrequests", () => {
    describe("offset and limit both are undefined", () => {

        test('should respond total and list of users', async() => {
            const response = await request(app).get("/api/criticsrequests").send()
            expect(response.statusCode).toBe(200)
        })
    })

    describe("either of offset and limit or both are set", () => {

        test('should respond total and list of users', async() => {
            const response = await request(app).get("/api/criticsrequests").query({ offset: 2 , limit: 1}).send()
            expect(response.statusCode).toBe(200)
        })
    })

} )