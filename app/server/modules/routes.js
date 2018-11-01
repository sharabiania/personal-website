var bm = require('../controllers/blog-manager');
var passport = require('passport');
module.exports = function(app) {


    app.get('/', function (req, res) {
        res.render('index', { title: 'Hey', message: 'Hello there!' });
	});
	  
    app.get('/login', function(req, res){
        res.render('login');
	});

	app.post('/login', 
		passport.authenticate('local', {successRedirect:'/', failureRedirect:'/login'}),
		function(req, res) {
			console.log('post login: authentication success');
			//res.session.auth = 
			res.render('index', {authenticated: true});
		}
	);

	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});

	// TODO move this
	function loggedIn(req, res, next) {
		console.log('req.user is ');
		console.log(req.user);
		if (req.user) {
			console.log('user is logged in');
			next();
		} else {
			res.redirect('/login');
		}
	}

	app.get('/blog', 
		loggedIn,
		function(req, res){
			console.log('get blog ...');
			console.log(req.user);
			bm.getAll(function(dbres){				
				res.render('blog-manage', {'blogs':dbres});
			});
			
	});

	app.get('/blog/create', function(req, res){
		res.render('blog-create');
	});

	app.post('/api/blog', function(req, res){
		bm.post({'title':req.body.title, 'desc': req.body.desc}, 
		function(dbres){
			res.send(dbres);
		});
		
	});

	app.get('/api/blog', function(req, res){
		bm.getAll(function(dbres){
			res.send(dbres);
		});
	});

	app.delete('/api/blog/:id', function(req, res){
		bm.remove(req.params.id, function(dbres){			
			res.send(dbres);
		});
	});
}