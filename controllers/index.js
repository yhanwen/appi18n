/*
 * GET home page.
 */

module.exports.controller = function(app) {
    app.get('/', function(req, res) {
        res.render('test', {
            title: 'Express',
            user: req.session.passport.user
        });
    });
}