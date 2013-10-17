/*
 * GET home page.
 */

module.exports.controller = function(app) {
    app.get('/boss', function(req, res) {
        console.log(req.session.user);
        res.render('boss/index', {
            title: 'Boss',
            user: req.session.user 
        });
    });
}