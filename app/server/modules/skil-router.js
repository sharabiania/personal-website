var sm = require('../controllers/db-manager')('skills');
var protected = require('../modules/auth').protectView;

module.exports = (function () {
	var router = require('express').Router();
	/** Skills Views */
	router.get('/',
		function (req, res) {
			var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
			console.log('hello there');
			sm.find(ip, function (dbres) {
				console.log('db response is:');
				console.log(dbres);
				var preview = false;
				if (req.query.p == 1) {
					preview = true;
				}
				if (req.user) {
					if (preview) {
						res.render('skil/skil-preview', { 'skills': dbres, 'authenticated': true, 'preview': true });
					}
					else
						res.render('skil/skil-manage', { 'skills': dbres, 'authenticated': true });
				}
				else
					res.render('skil/skil-preview', { 'skills': dbres, 'authenticated': false, 'preview': false });
			});

		});

	router.get('/create',
		protected,
		function (req, res) {
			res.render('skil/skil-create');
		});

	router.get('/update/:id', protected,
		function (req, res) {
			sm.getOne(req.params.id, function (dbres) {
				res.render('skil/skil-update', { b: dbres });
			});

		});
	/** END Blog Views */



	return router;
})();