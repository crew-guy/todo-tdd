const TodoController = require('../../controllers/test.controller')
const TodoModel = require('../../model/todo.model')
const httpMocks = require('node-mocks-http')

TodoModel.create = jest.fn();

describe("basic test to describe create todo", () => {
    it('does createTodo exist', () => {
        expect(typeof TodoController.createTodo).toBe("function");
    });
    it('does it call the create method', () => {
        let req, res, next;
        req = httpMocks.createRequest();
        req = httpMocks.createResponse();
        next = null
        TodoController.createTodo(req,res,next)
        expect(TodoModel.create).toBeCalled();
    })

})