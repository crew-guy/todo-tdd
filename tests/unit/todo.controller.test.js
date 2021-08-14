const TodoController = require('../../controllers/todo.controller')
const TodoModel = require('../../model/todo.model')
const httpMocks = require('node-mocks-http')
const newTodo = require('../mock-data/new-todo.json')
const allTodos = require('../mock-data/all-todos.json')


TodoModel.create = jest.fn();
TodoModel.find = jest.fn();

let req, res, next;
beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn()
})

describe("TodoController.getTodos", () => {
    it('ensures that get todo function exists', () => {
        expect(typeof TodoController.getTodos).toBe('function')
    })
    it('calls the find method on TodoModel', async() => {
        await TodoController.getTodos(req, res, next);
        expect(TodoModel.find).toHaveBeenCalledWith({});
    })
    it('ensures response code is 200 and response is returned', async () => {
        TodoModel.find.mockReturnValue(allTodos)
        await TodoController.getTodos(req, res, next);
        expect(res.statusCode).toBe(200)
        expect(res._isEndCalled).toBeTruthy()
        expect(res._getJSONData()).toStrictEqual(allTodos)
    })
})

describe("TodoController.createTodos", () => {
    beforeEach(() => {
        req.body = newTodo 
    })

    it('does createTodo exist', () => {
        expect(typeof TodoController.createTodo).toBe("function");
    });
    it('does it call the create method', () => {
        TodoController.createTodo(req,res,next)
        expect(TodoModel.create).toBeCalled();
    })
    it('response status code check and send check', async() => {
        await TodoController.createTodo(req, res, next)
        expect(res.statusCode).toBe(201)
        expect(res._isEndCalled()).toBeTruthy()
    })
    it('tested mock response',async () => {
        TodoModel.create.mockReturnValue(newTodo)
        await TodoController.createTodo(req, res, next)
        expect(res._getJSONData()).toStrictEqual(newTodo)
    })
    it('should handle errors', async() => {
        const errorMessage = { message: "Done property missing" }
        const rejectedPromise = Promise.reject(errorMessage)
        TodoModel.create.mockReturnValue(rejectedPromise)
        await TodoController.createTodo(res,req,next)
        expect(next).toBeCalledWith(errorMessage)
    })
})