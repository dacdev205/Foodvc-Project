const mongoose = require('mongoose')

// schema model
const userSchema = mongoose.Schema({
    userId: String,
    name: String,
    email: {
        type: String,
        trim: true,
        minlength: 3
    },
    photoURL: String,
    role: {
        type: String,
       enum: ['user', 'admin'],
       default: 'user'
    }
})


// create a model instance
module.exports = mongoose.model("User", userSchema)
