// IMPORT OF MONGOOSE
const mongoose = require('mongoose');
// IMPORT OF NORMALIZE MONGOOSE (MOVE _ID TO PUT ID)
const normalize = require('normalize-mongoose');

// USER MONGOOSE SCHEMA
const userSchema = mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    birthDay: {
        type: Date,
    },
    position: {
        lat: {
            type: Number,
            default: 0
        },
        lon: {
            type: Number,
            default: 0
        }
    }
}, {
    versionKey: false,
});

// USE THE NORMALIZE PLUGIN
userSchema.plugin(normalize);

module.exports = mongoose.model('user', userSchema)