var bm = require('../controllers/db-manager')('blogs');

module.exports = function (loggedIn) {
	var router = require('express').Router();
	/** Blog APIs */

	// TODO: Authorize the api call.
	router.post('/api/blog', function (req, res) {
		bm.post({ 'title': req.body.title, 'desc': req.body.desc },
			function (dbres) {
				res.send(dbres);
			});

	});

	// TODO: Authorize the api call.
	router.put('/api/blog/:id', function (req, res) {
		bm.update(req.params.id,
			{ 'title': req.body.title, 'desc': req.body.desc },
			function (dbres) {
				res.send(dbres);
			});
	});

	router.get('/api/blog', function (req, res) {
		var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

		bm.getAll(ip, function (dbres) {
			res.send(dbres);
		});
	});

	router.delete('/api/blog/:id', function (req, res) {
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
		console.log(req.body.message);
		bm.comment(req.params.id, ip, req.body.message, function(dbres){
			res.send(dbres);
		});
	});
	/** END Blog APIs */

	return router;
}