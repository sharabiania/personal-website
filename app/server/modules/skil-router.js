var sm = require('../controllers/db-manager')('skills');
var protectView = require('../modules/auth').protectView;
var ObjectId = require('mongodb').ObjectID;


module.exports = (function () {
	var router = require('express').Router();
	/** Skills Views */
	router.get('/',
		function (req, res) {
			var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
			var preview = false;
			if (req.query.p == 1) {
				preview = true;
			}
			if (req.user) {

					if (preview) {
						sm.getSkills(function(dbres){
							res.render('skil/skil-preview', { 'cats': dbres, 'authenticated': true, 'preview': true });
						});						
					}
					else {
						sm.find(ip, function(dbres){
							res.render('skil/skil-manage', { 'skills': dbres, 'authenticated': true });
						});
					}
			}
			else
				sm.getSkills(function(dbres){
					res.render('skil/skil-preview', { 'cats': dbres, 'authenticated': false, 'preview': false });
				});
				

		});

	router.get('/create',
		protectView,
		function (req, res) {
			sm.getAllFrom('categories', function(dbres){
				res.render('skil/skil-create', {cats: dbres});
			})	
		});

	

	router.get('/update/:id', protectView,
		function (req, res) {
			sm.getAllFrom('categories', function(c){
				
				sm.getOne(req.params.id, function (dbres) {
					res.render('skil/skil-update', { skil: dbres, cats: c });
				});
			})	
			

		});
	/** END Skills Views */

	router.post('/create', protectView, function(req, res){
		var obj = {name: req.body.name, rate: req.body.rate, cat: ObjectId(req.body.cat)};
		sm.post(obj, function(){
			res.redirect('/skill');
		});
	});

	router.post('/update/:id', protectView, function(req, res){
		var obj = {name: req.body.name, rate: req.body.rate, cat: ObjectId(req.body.cat)};

		sm.update(req.params.id, obj, function(dbres){
			//res.render('cat/cat-create', {res: dbres});
			res.redirect('/skill');
		});
	});

	return router;
})();