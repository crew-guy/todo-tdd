const express = require('express')
const router = express.Router()
const TodoController = require('../controllers/todo.controller.js')

router.post('/', TodoController.createTodo)
router.get('/', TodoController.getTodos)
router.get('/:todoId',TodoController.getTodo)
router.put('/:todoId',TodoController.updateTodo)


module.exports = router
