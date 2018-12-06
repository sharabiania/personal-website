var sm = require('../controllers/db-manager')('categories');
var protectView = require('../modules/auth').protectView;
var ObjectId = require('mongodb').ObjectID;


module.exports = (function () {
	var router = require('express').Router();
	/** Categories Views */
	router.get('/create',
		protectView,
		function (req, res) {
			console.log('cat create');
			res.render('cat/cat-create');
		});

	router.get('/',
		protectView,
		function (req, res) {
			sm.getAllFrom('categories', function(dbres){
				res.render('cat/cat-manage', {cats: dbres});
			})	
		});

	

	router.get('/update/:id', protectView,
		function (req, res) {
			console.log('update cat');
			sm.getOne(req.params.id, function (dbres) {
				console.log(dbres);

				res.render('cat/cat-update', { cat: dbres });
			});

		});
	/** END Skills Views */

	router.post('/create', protectView, function(req, res){
		console.log('creating cat');
		var obj = {name: req.body.name, desc: req.body.desc};
		sm.post(obj, function(){
			res.redirect('/category');
		});
	});

	router.post('/update/:id', protectView, function(req, res){
		var obj = {name: req.body.name, desc: req.body.desc};

		sm.update(req.params.id, obj, function(dbres){
			//res.render('cat/cat-create', {res: dbres});
			res.redirect('/category');
		});
	});

	

	return router;
})();