const  request = require('supertest')
const {app} = require('../index')

describe("POST/book", () => {

    describe("given book info to create book", () => {

        test('should respond with a 200 status code if respond is false', async () => {
            const response = await request(app).post("/api/book").send({
                title: "Test Book",
                author: 2,
                genre: [2],
                description:"test book info"
            })
            expect(response.statusCode).toBe(200)
        })
    })
})

describe("DEL/book", () => {
    describe("delete book from info ", () => {
        test('delete book with given id' , async () => {
            const response = await request(app).delete("/api/book").query({ id: 'abc' }).send()
            expect(response.statusCode).toBe(200)
        })
    })
})

describe("PUT/book",() => {
    describe("update book info", () => {
        test('update book info using book id', async() => {
            const response = await request(app).put("/api/book").query({ id: 'fZDMfzrEb30cv3wpGKqF' }).send({
                description:"test book info"
            })
            expect(response.statusCode).toBe(200)   
        })
    })
})

///books/filtered"

describe("/books/filtered",() => {
    describe("Filter books using filters", () => {
        test('Filter parameters', async() => {
            const bodyType = [
                {averageRating:2},
                // {title:'book'},
                // {genre:[1,2]},
                // {author:1}
            ]

            for(const body in bodyType){
                const response = await request(app).post("/api/books/filtered").query({ offset: 0 ,limit: 2}).send({
                    filter: body
                })

                expect(response.statusCode).toBe(200)   
            }
        })
    })
})