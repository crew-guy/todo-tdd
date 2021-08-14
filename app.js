const express = require('express')
const app = express();
const todoRoutes = require('./routes/todo.routes')
const mongodb = require('./mongodb/mongodb.connect')
app.use(express.json())

mongodb.connect();

app.use('/todos', todoRoutes);
app.get('/', (req, res) => {
    res.json('Hello world')
})

app.use((error, req, res, next) => {
    res.status(500).json({message:error.message})
})

// app.use((error, req, res, next) => {
    
// })

// const port = 8000 || process.env.PORT
// app.listen(port, () => console.log(`Listening on port ${port}`))
// const port = 8000 || process.env.PORT
// app.listen(8000, () => console.log(`Listening on port 8000`))

module.exports = app