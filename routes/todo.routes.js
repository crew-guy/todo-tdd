const express = require('express')
const router = express.Router()
const TodoController = require('../controllers/todo.controller.js')

router.post('/', TodoController.createTodo)

module.exports = router
