var bm = require('../controllers/blog-manager');
var passport = require('passport');
module.exports = function (app) {

	app.get('/', function (req, res) {
		var isauth = false;
		if (req.user) isauth = true;
		res.render('index', { title: 'Hey', message: 'Hello there!', 'authenticated': isauth });
	});

	app.get('/login', function (req, res) {
		var isauth = false;
		if (req.user) isauth = true;
		res.render('login', { 'authenticated': isauth });
	});

	app.post('/login',
		passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }),
		function (req, res) {
			res.render('index', { authenticated: true });
		}
	);

	app.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
	});

	// TODO move this
	// Handle redirecturl in query string.
	function loggedIn(req, res, next) {
		if (req.user) {
			next();
		} else {
			res.redirect('/login');
		}
	}

	app.get('/blog',
		function (req, res) {
			var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

			bm.getAll(ip, function (dbres) {
				var preview = false;
				if (req.query.p == 1) {
					preview = true;
				}
				if (req.user) {
					if (preview) {
						res.render('blog-preview', { 'blogs': dbres, 'authenticated': true, 'preview': true });
					}
					else
						res.render('blog-manage', { 'blogs': dbres, 'authenticated': true });
				}
				else
					res.render('blog-preview', { 'blogs': dbres, 'authenticated': false, 'preview': false });
			});

		});

	app.get('/blog/create',
		loggedIn,
		function (req, res) {
			res.render('blog-create', { 'authenticated': true });
		});

	app.post('/api/blog', function (req, res) {
		bm.post({ 'title': req.body.title, 'desc': req.body.desc },
			function (dbres) {
				res.send(dbres);
			});

	});

	app.get('/api/blog', function (req, res) {
		var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	
		bm.getAll(ip, function (dbres) {
			res.send(dbres);
		});
	});

	app.delete('/api/blog/:id', function (req, res) {
		bm.remove(req.params.id, function (dbres) {
			res.send(dbres);
		});
	});

	app.post('/api/blog/like/:id', function(req, res){
		var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	
		bm.like(req.params.id, ip, function(dbres){
			res.send(dbres);
		})
	});

	app.post('/api/blog/unlike/:id', function(req, res){
		var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	
		bm.unlike(req.params.id, ip, function(dbres){
			res.send(dbres);
		})
	});
}