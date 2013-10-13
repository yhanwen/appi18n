/*
 * GET home page.
 */
var models = require('../models/user.js');
var User = models.User;

var passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new FacebookStrategy({
        clientID: '367021076767605',
        clientSecret: '83066bf493a61d564513e623da81ac41',
        callbackURL: "http://local.host:3000/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        console.log(profile._json.languages);
        var languages = [];
        for(l in profile._json.languages){
            languages.push(profile._json.languages[l].name)
        }
        User.findOrCreate({
            username: 'facebook:' + profile.username,
            email:  profile.emails[0].value,
            languages: languages
        }, function(err, user) {
            return done(null, user);
        });
    }));

module.exports.controller = function(app) {
    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: ['email']
    }));

    // Facebook will redirect the user to this URL after approval.  Finish the
    // authentication process by attempting to obtain an access token.  If
    // access was granted, the user will be logged in.  Otherwise,
    // authentication has failed.
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/',
            failureRedirect: '/'
        })
    );
    app.post('/signup', function(req, res) {
        u = new User(req.body);
        u.save();
        res.send(u);
    });
    app.get('/signin', function(req, res) {
        res.render('index', {
            title: 'Express'
        });
    });
    app.get('/auth/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
}