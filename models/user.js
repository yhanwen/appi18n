var mongoose = require('mongoose');

// User Schema
var userSchema = mongoose.Schema({
    email: String,
    languages: [String],
    usertype: String,
    nickname: String,
    password: String,
    facebook: String,
});

// Seed a user
module.exports.User = mongoose.model('User', userSchema);