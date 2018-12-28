var bm = require('../controllers/db-manager')('blogs');
var protected = require('../modules/auth').protectAPI;

module.exports = (function () {
	var router = require('express').Router();
	/** Blog APIs */

	router.post('/api/blog', protected, function (req, res) {
		var obj = { 
			'title': req.body.title, 'desc': req.body.desc, 
		};
		bm.post(obj,
			function (dbres) {
				res.send(dbres);
			});

	});

	router.put('/api/blog/:id', protected, function (req, res) {
	
		var obj = { 
			'title': req.body.title, 'desc': req.body.desc, 
			'published' : req.body.published
		};
		var temp = null;
		try{
			temp = (new Date(req.body['published-on'])).toISOString();
		}
		catch{}
		if(temp != null) obj['published-on'] = temp;

		bm.update(req.params.id, 
			obj,
			function (dbres) {
				res.send(dbres);
			});
	});

	// router.get('/api/blog', function (req, res) {
	// 	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

	// 	bm.getAll(ip, {'published-on':-1}, function (dbres) {
	// 		res.send(dbres);
	// 	});
	// });

	router.delete('/api/blog/:id',protected, function (req, res) {
		bm.remove(req.params.id, function (dbres) {
			res.send(dbres);
		});
	});

	router.post('/api/blog/like/:id', function (req, res) {
		var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

		bm.like(req.params.id, ip, function (dbres) {
			res.send(dbres);
		});
	});

	router.post('/api/blog/unlike/:id', function (req, res) {
		var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

		bm.unlike(req.params.id, ip, function (dbres) {
			res.send(dbres);
		});
	});

	router.post('/api/blog/comment/:id', function(req, res){
		var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		bm.comment(req.params.id, ip, req.body.message, function(dbres){
			res.send(dbres);
		});
	});
	/** END Blog APIs */

	return router;
})();