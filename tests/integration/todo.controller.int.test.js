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
})