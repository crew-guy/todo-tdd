const request = require('supertest')
const newTodo = require('../mock-data/new-todo.json')
const endpointUrl = "/todos"
const app = require('../../app')


describe('integration test for posting', () => {
    it("POST " + endpointUrl, async () => {
        const response = await request(app).post(endpointUrl).send(newTodo)
        expect(response.statusCode).toBe(201)
        expect(response.body.title).toBe(newTodo.title)
        expect(response.body.done).toBe(newTodo.done)
    })
    it(`should return error 500 on malformed data ki POST at ${endpointUrl}`, async() => {
        const response = await request(app).post(endpointUrl).send({ title: "This message's done property is missing" })
        expect(response.statusCode).toBe(500)
        expect(response.body).toStrictEqual({
            message:'Todo validation failed: done: Path `done` is required.'
        })
    })
});