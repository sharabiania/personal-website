var bm = require('../controllers/db-manager')('blogs');
var protected = require('../modules/auth').protectView;

module.exports = (function () {
	var router = require('express').Router();
	/** Blog Views */
	router.get('/',
		function (req, res) {
			var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

			bm.getAll(ip, {'published-on':-1, updated:-1, created:-1}, function (dbres) {
				var preview = false;
				if (req.query.p == 1) {
					preview = true;
				}
				if (req.user) {
					if (preview) {
						res.render('blog/blog-preview', { 'blogs': dbres, 'authenticated': true, 'preview': true });
					}
					else
						res.render('blog/blog-manage', { 'blogs': dbres, 'authenticated': true });
				}
				else
					res.render('blog/blog-preview', { 'blogs': dbres, 'authenticated': false, 'preview': false });
			});

		});

	router.get('/create',
		protected,
		function (req, res) {
			res.render('blog/blog-create');
		});

	router.get('/update/:id', protected,
		function (req, res) {
			bm.getOne(req.params.id, function (dbres) {
				res.render('blog/blog-update', { b: dbres });
			});

		});
	/** END Blog Views */



	return router;
})();