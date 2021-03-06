const TodoController = require('../../controllers/todo.controller')
const TodoModel = require('../../model/todo.model')
const httpMocks = require('node-mocks-http')
const newTodo = require('../mock-data/new-todo.json')
const allTodos = require('../mock-data/all-todos.json')
const updatedTodo = require('../mock-data/updated-todo.json')
const deletedTodo = require('../mock-data/deleted-todo.json')

// To individually create mock functions of each method on this model
TodoModel.create = jest.fn();
TodoModel.find = jest.fn();
TodoModel.findById = jest.fn();
TodoModel.findByIdAndUpdate = jest.fn();
TodoModel.findByIdAndDelete = jest.fn();

// To once and for all create mock functions of all methods on this model
jest.mock('../../model/todo.model.js')

let req, res, next, testTodoId;
beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn()
    testTodoId = "6117ec7de274e8c9273bf293"
    // jest.setTimeout(60000);
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
    it('ensures that errors are handled properly', async () => {
        const errorMessage = { message: "Could not fetch todos" }
        const rejectedPromise = Promise.reject(errorMessage)
        TodoModel.find.mockReturnValue(rejectedPromise)
        await TodoController.getTodos(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage)
    })
})


describe('get Todo using its uuid', () => {
    it('check that the get todo function exists', () => {
        expect(typeof TodoController.getTodo).toBe('function')
    })
    it('check that the find method on TodoModel is called with id', async () => {
        req.params.todoId= "6117ec7de274e8c9273bf293"
        await TodoController.getTodo(req, res, next);
        expect(TodoModel.findById).toBeCalledWith("6117ec7de274e8c9273bf293")
    })
    it('should return json body and a response status of 200', async() => {
        TodoModel.findById.mockReturnValue(newTodo);
        req.params.todoId = "6117ec7de274e8c9273bf293"
        await TodoController.getTodo(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled).toBeTruthy();
        expect(res._getJSONData()).toStrictEqual(newTodo);
    })
    it('should return a throw error message', async () => {
        const errorMessage = { message: "404 error. Entry not found" }
        const rejectedPromise = Promise.reject(errorMessage)
        TodoModel.findById.mockReturnValue(rejectedPromise)
        await TodoController.getTodo(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage)
    })
    it(`should throw a 404 error message in case todo doesn't exist`, async () => {
        TodoModel.findById.mockReturnValue(null)
        await TodoController.getTodo(req, res, next)
        expect(res.statusCode).toBe(404)
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

describe("TodoController.updateTodo", () => {

    beforeEach(() => {
        req.params.todoId = testTodoId
        req.body = updatedTodo
    })
    it('controller should have an update todo function', () => {
        expect(typeof TodoController.updateTodo).toBe('function')
    })
    it('findByIdAndUpdate must be called with the necessary params', async() => {
        TodoModel.findByIdAndUpdate.mockReturnValue(updatedTodo);
        await TodoController.updateTodo(req,res,next)
        expect(TodoModel.findByIdAndUpdate).toHaveBeenCalledWith(testTodoId, updatedTodo, {
            new: true,
            useFindAndModify:false
        });
    })
    it('should have a response and status should be 200', async () => {
        TodoModel.findByIdAndUpdate.mockReturnValue(updatedTodo)
        await TodoController.updateTodo(req, res, next);
        expect(res.statusCode).toBe(200)
        expect(res._getJSONData()).toStrictEqual(updatedTodo)
    })
    it('should throw error to next function in case of err', async () => {
        const errorMessage = { message: "The entry you wanna update was not found" }
        const rejectedPromise = Promise.reject(errorMessage)
        TodoModel.findByIdAndUpdate.mockReturnValue(rejectedPromise)
        await TodoController.updateTodo(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage)
    })
    it('should throw 404 error if todo to update was never found', async () => {
        TodoModel.findByIdAndUpdate.mockReturnValue(null);
        await TodoController.updateTodo(req, res, next);
        expect(res.statusCode).toBe(404)
        expect(res.body).toBe(undefined)
    })
})

describe('TodoController.deleteTodo', () => {
    beforeEach(() => {
        req.params.todoId = testTodoId
    })
    it('ensures that a delete function exists on controller', () => {
        expect(typeof TodoController.deleteTodo).toBe('function')
    })
    it('ensures that find by id and delete is called with accurate params', async() => {
        TodoModel.findByIdAndDelete.mockReturnValue(deletedTodo)
        await TodoController.deleteTodo(req,res,next)
        expect(TodoModel.findByIdAndDelete).toHaveBeenCalledWith(testTodoId)
    })
    it('ensures response is returned and status code is 200', async () => {
        TodoModel.findByIdAndDelete.mockReturnValue(deletedTodo)
        await TodoController.deleteTodo(req, res, next);
        expect(res.statusCode).toBe(200)
        expect(res._isEndCalled).toBeTruthy()
        expect(res._getJSONData()).toStrictEqual(deletedTodo)
    })
    it('should check that error was returned', async () => {
        const errorMessage= {message:"The queried item could not be deleted"}
        const rejectedPromise = Promise.reject(errorMessage)
        TodoModel.findByIdAndDelete.mockReturnValue(rejectedPromise)
        await TodoController.deleteTodo(req, res, next)
        expect(next).toHaveBeenCalledWith(errorMessage)
    })
    it('should return 404 error if entry was not found', async () => {
        TodoModel.findByIdAndDelete.mockReturnValue(null)
        await TodoController.deleteTodo(req, res, next)
        expect(res.statusCode).toBe(404)
    })
})