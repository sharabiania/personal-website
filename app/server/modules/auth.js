var passport = require('passport');
var Strategy = require('passport-local').Strategy;

var um = require('../controllers/user-manager.js');
module.exports = {
	protectAPI: function(req, res, next){
		if(req.user) next();
		else res.sendStatus(401);
	},
	protectView: function (req, res, next) {
		// Handle redirecturl in query string.

		if (req.user) {
			next();
		} else {
			res.redirect('/login');
		}
	},

	auth: function (app) {
		// TODO: investigate why maxAge doesn't work.
		app.use(require('express-session')({
			name: 'auth',
			secret: 'keyboard cat',
			maxAge: 60000,
			resave: false,
			saveUninitialized: false
		}));
		app.use(passport.initialize());
		app.use(passport.session());


		/**
		 * Configure the local strategy for use by Passport.
		 * 
		 * The local strategy requires a `verify` function which receives the credentials
		 * (`username` and `password`) submitted by the user. The function must verify that
		 * the password is correct and then invoke `cb` with a user object, which will be set 
		 * at `req.user` in route handlers after authentication.
		 */
		passport.use(new Strategy(function (username, password, cb) {
			um.findByUsername(username, function (err, user) {
				if (err) {
					return cb(err);
				}
				if (!user) {
					return cb(null, false);
				}
				if (user.password != password) {
					return cb(null, false);
				}
				return cb(null, user);
			});
		}));

		/** 
		 * Configure Passport authenticated session persistence.
		 *
		 * In order to restore authentication state across HTTP requests, Passport needs
		 * to serialize users into and deserialize users out of the session.  The
		 * typical implementation of this is as simple as supplying the user ID when
		 * serializing, and querying the user record by ID from the database when
		 * deserializing.
		 */
		passport.serializeUser(function (user, cb) {
			cb(null, user._id);
		});

		passport.deserializeUser(function (id, cb) {
			um.findUserById(id, function (err, user) {
				cb(null, user);
			});
		});

		// TODO: move to a proper place
		app.post('/', this.protectView, function(req, res){
			um.upsertContent('home', {content: req.body.content}, function(){
				res.redirect('/');
			});
		});

		/** Authentication Views */
		app.get('/', function (req, res) {
			var isauth = false;
			if (req.user) isauth = true;
			um.findContent('home', function(dbres){
				res.render('index', { homeContent:dbres.content, authenticated: isauth });
			});
		});

		/** Authentication Views */
		app.get('/login', function (req, res) {
			var isauth = false;
			if (req.user) isauth = true;
			res.render('auth/login', { 'authenticated': isauth });
		});

		app.post('/login',
			passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }),
			function (req, res) {
				um.findContent('home', function(dbres){
					res.render('index', { homeContent:dbres.content, authenticated: true });
				});
			}
		);

		app.get('/logout', function (req, res) {
			req.logout();
			res.redirect('/');
		});
		/** END Authentication Views */

	}
}