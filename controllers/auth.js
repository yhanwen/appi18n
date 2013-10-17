/*
 * GET home page.
 */
var models = require('../models/user.js');
var User = models.User;

var passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy;

var facebook_clientid = process.env.APPSETTING_FACEBOOK_CLIENTID || '667306946621513';
var facebook_clientsecret = process.env.APPSETTING_FACEBOOK_CLIENTSECRET || 'f6e417e5a19f98fd45d80cf06c54faf8';
var facebook_callback = process.env.APPSETTING_FACEBOOK_CALLBACK || 'http://local.host:3000/auth/facebook/callback';

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new FacebookStrategy({
        clientID: facebook_clientid,
        clientSecret: facebook_clientsecret,
        callbackURL: facebook_callback
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOne({
            facebook: profile.id
        }, function(err, user) {
            if (err) {
                done(null, err);
            }
            if (user) {
                done(null, user);
            } else {
                var languages = [];
                for (l in profile._json.languages) {
                    languages.push(profile._json.languages[l].name)
                }
                User.create({
                    facebook: profile.id,
                    email: profile.emails[0].value,
                    languages: languages
                }, function(err, user) {
                    if (err) {
                        done(null, err);
                    }
                    if (user) {
                        done(null, user);
                    } else {
                        done(null, null)
                    }
                })
            }

        });
    }));

function checkAuth(req, res, next) {
    if (!req.session.user) {
        res.send('Please <a href="/auth/login">Login First</a>');
    } else {
        next();
    }
}

module.exports.controller = function(app) {
    app.all('/auth/login', function(req, res) {
        if (req.session.passport.user) {
            User.findById(req.session.passport.user._id, function(err, user) {
                req.session.user = user;
                res.redirect('/')
            });
        }
        else if (req.method == 'POST') {
            User.findOne(req.body, function(err, user) {
                if (user) {
                    req.session.user = user;
                    res.redirect('/')
                } else {
                    res.render('login', {
                        msg: 'Login Failed.'
                    });
                }
            });
        }
        else{
            res.render('login');
        }
    });
    app.all('/auth/register', function(req, res) {
        if (req.session.user) {
            // already login            
            res.redirect('/');
        }
        else if (req.method == 'POST') {
            User.findOne(req.body, function(err, user) {
                if (user) {
                    req.session.user = user;
                    res.redirect('/')
                } else {
                    res.render('register', {
                        msg: 'Login Failed.'
                    });
                }
            });
        }
        else{
            res.render('register');
        }
    });
    app.get('/auth/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: ['email']
    }));
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/auth/login',
            failureRedirect: '/auth/login'
        })
    );

    app.all('/auth/profile', checkAuth, function(req, res) {
        if (req.method == 'POST') {
            if (req.body.set_profile || req.body.set_password) {
                User.findByIdAndUpdate(
                    req.session.user._id,
                    req.body,
                    function(err, user) {});
            }
            if (req.body.set_account) {
                User.findById(req.session.user._id, function(err, user) {
                    User.findOne({
                        email: req.body.email,
                        password: req.body.password
                    }, function(err, old_user) {
                        old_user.facebook = user.facebook;
                        if (old_user.languages.length < user.languages.length) {
                            old_user.languages = user.languages;
                        }
                        old_user.save();
                        user.remove();
                    });
                });
            }
        }
        User.findById(req.session.user._id, function(err, user) {
            res.render('profile', {
                user: user
            });
        });
    });
}