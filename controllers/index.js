/*
 * GET home page.
 */

module.exports.controller = function(app) {
    app.get('/', function(req, res) {
        console.log(req.session.user);
        res.render('index', {
            title: 'Express',
            user: req.session.user 
        });
    });
}