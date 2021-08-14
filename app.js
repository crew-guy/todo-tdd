const app = require('express')();


app.get('/', (req, res) => {
    res.json('Hello world')
})

const port = 8000 || process.env.PORT
app.listen(port, ()=>console.log(`Listening on port ${port}`))