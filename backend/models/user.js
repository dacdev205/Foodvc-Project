const mongoose = require('mongoose')
// schema model
const userSchema = mongoose.Schema({
    userId: {
        type: String ,
    },
    name: {
        type: String ,
    },
    email: {
        type: String,
        trim: true,
        minlength: 3
    },
    photoURL: {
        type: String,
    },
    role: {
        type: String,
       enum: ['user', 'admin','staff'],
       default: 'user'
    }
})


// create a model instance
module.exports = mongoose.model("User", userSchema)
