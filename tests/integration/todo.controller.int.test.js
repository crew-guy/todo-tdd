const request = require('supertest')
const newTodo = require('../mock-data/new-todo.json')
const app = require('../../app')

const endpointUrl = "/todos/"

describe('integration test for posting' + endpointUrl, () => {
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

describe('integration test for getting', () => {
    it('GET' + endpointUrl, async() => {
        const response = await request(app).get(endpointUrl)
        expect(response.statusCode).toBe(200)
        expect(typeof response.body).toBe('array')
        expect(response.body[0].title).toBeDefined();
    })
    it('should return a 404 error on unavailable data' + endpointUrl, async () => {
        const response = await request(app).get(endpointUrl);
        expect(response.statusCode).toBe(404)
        expect(response.body).toStrictEqual({
            message:"Could not fetch all todos"
        })
    })
})