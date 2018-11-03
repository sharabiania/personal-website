module.exports = function (app) {

	var auth = require('./auth');
	auth.auth(app);
	app.use('/blog', require('./blog-router')(auth.loggedIn));
	app.use('/project', require('./proj-router')(auth.loggedIn));
	app.use('/', require('./blog-api')(auth.loggedIn));
	app.use('/', require('./proj-api')(auth.loggedIn));	
	
}