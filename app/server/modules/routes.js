module.exports = function (app) {

	var auth = require('./auth');
	auth.auth(app);
	app.use('/blog', require('./blog-router')(auth.loggedIn));
	app.use('/project', require('./proj-router')(auth.loggedIn));
	app.use('/', require('./blog-api')(auth.loggedIn));
	app.use('/', require('./proj-api')(auth.loggedIn));	

	app.get('/contact', function(req, res){
		res.render('contact', {sent: false});
	});

	app.post('/contact', function(req, res){
		dm = require('../controllers/db-manager')('messages');
		
		// TODO: Create a helper function GetIP
		var uip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

		dm.post({ip: uip, message: req.body.message}, function(dbres){
			res.render('contact', {sent: true});
		});
	});
	
}