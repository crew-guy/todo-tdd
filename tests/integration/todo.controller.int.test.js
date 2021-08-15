const request = require('supertest')
const newTodo = require('../mock-data/new-todo.json')
const app = require('../../app')

const endpointUrl = "/todos/"

let firstTodo

describe(endpointUrl + "integration test on posting a request", () => {
    
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

describe(endpointUrl + 'integration tests on getting todos',  () => {
    test('GET ' + endpointUrl, async() => {
        const response = await request(app).get(endpointUrl);
        // console.log(response)
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy()
        expect(response.body[0].title).toBeDefined()
        firstTodo = response.body[0]
    })
    test('GET ' + endpointUrl + ':/todoId', async() => {
        const response = await request(app).get(endpointUrl + firstTodo._id)
        expect(response.statusCode).toBe(200)
        expect(response.body.title).toBeDefined()
        expect(response.body.done).toBeDefined()
    })
})