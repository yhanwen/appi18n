/*
 * GET home page.
 */
var fs = require('fs');
var models = require('../models/app.js');
var AppModel = models.App;
var AppStr = models.AppStr;

module.exports.controller = function(app) {
    app.get('/boss', app.locals.checkAuth, function(req, res) {
        res.render('boss/index', {
            title: 'Boss',
            user: req.session.user
        });
    });
    app.get('/boss/apps', app.locals.checkAuth, function(req, res) {
        AppModel.find({user: req.session.user._id}, function(err, apps){
            if(apps){
                res.render('boss/apps', {
                    title: 'Apps',
                    user: req.session.user,
                    apps: apps
                });
            }else{
                res.send('empty')
            }
        });
    });
    app.get('/boss/app/:id', app.locals.checkAuth, function(req, res) {
        AppModel.findById(req.params.id, function(err, app_obj){
            AppStr.find({app:app_obj._id}, function(err, appstrs){
                res.render('boss/app', {                    
                    title: app_obj.name,
                    user: req.session.user,
                    app: app_obj,
                    appstrs: appstrs
                })
            })
        });
    });
    app.all('/boss/app/:id/upload', app.locals.checkAuth, function(req, res) {
        if(req.method == 'POST'){
            var string_resouces = fs.readFileSync(req.files.file.path, 'utf8');
        }else{
            AppModel.findById(req.params.id, function(err, app_obj){
                res.render('boss/app_upload', {
                    title: app_obj.name,
                    user: req.session.user,
                    app: app_obj,
                });
            });
        }
    });
    app.all('/boss/apps/create', app.locals.checkAuth, function(req, res) {
        if (req.method == 'POST') {
            var app_obj = req.body;
            app_obj.user = req.session.user._id;
            AppModel.create(app_obj, function(err, a) {
                if (err) {
                    res.send(err);
                } else {
                    res.redirect('/boss/apps')
                }
            })
        }else{
            res.render('boss/apps_create', {
                title: 'Create',
                user: req.session.user,
                languages: app.locals.languages
            });
        }
    });
}
