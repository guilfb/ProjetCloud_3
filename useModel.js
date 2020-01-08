const mongoose = require('mongoose')


//setup schema
const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        unique: true,
        required: true
    },
    lastName: {
        type: String,
        unique: true,
        required: true
    },
    birthDdate: {
        type: Date,
        default: Date.now()
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    position: {
        lat: { type: Number, default: 0},
        lon: {type: Number, default: 0}
    }
})
