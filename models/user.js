var mongoose = require('mongoose');

// User Schema
var userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: String,
    languages: [String],
    usertype: String,
});

userSchema.statics.findOrCreate = function(conditions, doc, options, callback) {
    if (arguments.length < 4) {
        if (typeof options === 'function') {
            // Scenario: findOrCreate(conditions, doc, callback)
            callback = options;
            options = {};
        } else if (typeof doc === 'function') {
            // Scenario: findOrCreate(conditions, callback);
            callback = doc;
            doc = {};
            options = {};
        }
    }
    var self = this.model('User');
    this.findOne(conditions, function(err, result) {
        if (err || result) {
            if (options && options.upsert && !err) {
                self.update(conditions, doc, function(err, count) {
                    self.findOne(conditions, function(err, result) {
                        callback(err, result, false);
                    });
                })
            } else {
                callback(err, result, false)
            }
        } else {
            for (var key in doc) {
                conditions[key] = doc[key];
            }
            var obj = new self(conditions)
            obj.save(function(err) {
                callback(err, obj, true);
            });
        }
    })
}
// Seed a user
module.exports.User = mongoose.model('User', userSchema);