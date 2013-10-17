var mongoose = require('mongoose');

var schema = mongoose.Schema({
    name: String,
    description: String, 
    origin: String,
    destination: String,
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
});
module.exports.App = mongoose.model('App', schema);

var schema = mongoose.Schema({
    name: String,
    value: String,
    app: {type: mongoose.Schema.Types.ObjectId, ref: "App"}
});
module.exports.AppStr= mongoose.model('AppStr', schema);
