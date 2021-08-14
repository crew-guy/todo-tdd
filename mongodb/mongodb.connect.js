const mongoose = require('mongoose')

const connect = async () => {
    try {
        await mongoose.connect(
            "mongodb+srv://ankit1841:anA56sz3*M108@tdd-todo.rmcc6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            {useNewUrlParser:true, useUnifiedTopology:true}
        )
    } catch (err) {
        console.error('Error connecting to database')
        console.error(err)
    }
}

module.exports = {connect}