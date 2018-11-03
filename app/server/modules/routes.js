var bm = require('../controllers/db-manager')('blogs');
var pm = require('../controllers/db-manager')('projects');
var passport = require('passport');
module.exports = function (app) {

	app.get('/', function (req, res) {
		var isauth = false;
		if (req.user) isauth = true;
		res.render('index', { title: 'Hey', message: 'Hello there!', 'authenticated': isauth });
	});

	/** Authentication Views */
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
	/** END Authentication Views */

	// TODO move this
	// Handle redirecturl in query string.
	function loggedIn(req, res, next) {
		if (req.user) {
			next();
		} else {
			res.redirect('/login');
		}
	}

	/** Blog Views */
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
			res.render('blog-create');
		});

	app.get('/blog/update/:id',
		// TODO:	loggedIn,
		function (req, res) {
			bm.getOne(req.params.id, function (dbres) {
				res.render('blog-update', { b: dbres });
			});

		});
	/** END Blog Views */

	/** Project Views */
	app.get('/project',
		function (req, res) {
			var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

			pm.getAll(ip, function (dbres) {
				var preview = false;
				if (req.query.p == 1) {
					preview = true;
				}
				if (req.user) {
					if (preview) {
						res.render('proj-preview', { 'projs': dbres, 'authenticated': true, 'preview': true });
					}
					else
						res.render('proj-manage', { 'projs': dbres, 'authenticated': true });
				}
				else
					res.render('proj-preview', { 'projs': dbres, 'authenticated': false, 'preview': false });
			});

		});

	app.get('/project/create',
		loggedIn,
		function (req, res) {
			res.render('proj-create');
		});

	app.get('/project/update/:id',
		// TODO:	loggedIn,
		function (req, res) {
			pm.getOne(req.params.id, function (dbres) {
				res.render('proj-update', { b: dbres });
			});

		});
	/** END Project Views */

	/** Project API */
	// NOTE: this is a form/multipart request not a JSON api call.
	app.post('/project', function (req, res) {

		var imageFile = req.files.image;
		var uploadsFolderName = 'uploads'
		var fileName = imageFile.name;
		// TODO: IMPORTANT get the path to the app folder instead of doing /../../
		var uploadDir = __dirname + '/../../public/' + uploadsFolderName + '/';
		uploadPath = uploadDir + fileName;
		var fs = require('fs');
		if (!fs.existsSync(uploadDir))
			fs.mkdirSync(uploadDir);

		imageFile.mv(uploadPath, function (err) {
			if (err) {
				return res.status(500).send(err);
			}
		});
		var obj = {
			'title': req.body.title,
			'desc': req.body.desc,
			'images': [{ 'path': uploadPath, 'uri': '/' + uploadsFolderName + '/' + fileName }]
		};
		pm.post(obj, function (dbres) {
			res.redirect('/project');
		});

	});

	// TODO: Authorize the api call.
	app.put('/api/project/:id', function (req, res) {
		pm.update(req.params.id,
			{ 'title': req.body.title, 'desc': req.body.desc },
			function (dbres) {
				res.send(dbres);
			});
	});

	app.get('/api/project', function (req, res) {
		var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

		pm.getAll(ip, function (dbres) {
			res.send(dbres);
		});
	});

	app.delete('/api/project/:id', function (req, res) {
		pm.remove(req.params.id, function (dbres) {
			res.send(dbres);
		});
	});

	app.post('/api/project/like/:id', function (req, res) {
		var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

		pm.like(req.params.id, ip, function (dbres) {
			res.send(dbres);
		})
	});

	app.post('/api/project/unlike/:id', function (req, res) {
		var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

		pm.unlike(req.params.id, ip, function (dbres) {
			res.send(dbres);
		})
	});
	/** END Project API */

	/** Blog APIs */

	// TODO: Authorize the api call.
	app.post('/api/blog', function (req, res) {
		bm.post({ 'title': req.body.title, 'desc': req.body.desc },
			function (dbres) {
				res.send(dbres);
			});

	});

	// TODO: Authorize the api call.
	app.put('/api/blog/:id', function (req, res) {
		bm.update(req.params.id,
			{ 'title': req.body.title, 'desc': req.body.desc },
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

	app.post('/api/blog/like/:id', function (req, res) {
		var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

		bm.like(req.params.id, ip, function (dbres) {
			res.send(dbres);
		})
	});

	app.post('/api/blog/unlike/:id', function (req, res) {
		var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

		bm.unlike(req.params.id, ip, function (dbres) {
			res.send(dbres);
		})
	});
	/** END Blog APIs */
}