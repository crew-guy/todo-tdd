const request = require('supertest')
const newTodo = require('../mock-data/new-todo.json')
const updatedTodo = require('../mock-data/updated-todo.json')
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
    test('GET ' + endpointUrl + ':/todoId' + ' -> 404 error if id does not exist', async() => {
        const response = await request(app).get(endpointUrl + "6117ec7de274e8c7273bf294")
        expect(response.statusCode).toBe(404)
    })
})

describe(endpointUrl + 'integration tests for updating a todo by id', () => {
    test('GET ' + endpointUrl, async() => {
        const response = await request(app).get(endpointUrl);
        // console.log(response)
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy()
        expect(response.body[0].title).toBeDefined()
        firstTodo = response.body[0]
    })
    it('PUT ' + endpointUrl + ":/todoId", async () => {
        const response = await request(app).put(endpointUrl + firstTodo._id).send(updatedTodo)
        expect(response.statusCode).toBe(200)
    })
})

describe(endpointUrl + "integration tests for deleting a todo by id", () => {
    test('DELETE ' + endpointUrl + ":/todoId", async () => {
        const response = await request(app).delete(endpointUrl + firstTodo._id)
        expect(response.statusCode).toBe(200)
        expect(response.body.title).toBeDefined();
    })
    test('DELETE ' + endpointUrl + ":/todoId", async () => {
        const response = await request(app).delete(endpointUrl + "6117ec7de274e8c7273bf294")
        expect(response.statusCode).toBe(404)
    })
})