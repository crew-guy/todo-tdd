const TodoModel = require("../model/todo.model")

exports.createTodo = async (req, res, next) => {
    try {
        const createdModel = await TodoModel.create(req.body)
        res.status(201).json(createdModel)
    } catch (error) {
        next(error)        
    }
}

exports.getTodos = async (req, res, next) => {
    try {
        const gottenTodos = await TodoModel.find({});
        res.status(200).json(gottenTodos)
    } catch (error) {
        next(error)
    }
}

exports.getTodo = async (req, res, next) => {
    try {
        const gottenTodo = await TodoModel.findById(req.params.todoId)
        if (gottenTodo) {
            res.status(200).json(gottenTodo)
        }
        else {
            res.status(404).json(gottenTodo)
        }
    } catch (error) {
        next(error)
    }
}