var pm = require('../controllers/db-manager')('projects');

module.exports = function (loggedIn) {

	var router = require('express').Router();
	/** Project API */

	

	// TODO: Authorize the api call.
	router.put('/api/project/:id', function (req, res) {
		pm.update(req.params.id,
			{ 'title': req.body.title, 'desc': req.body.desc },
			function (dbres) {
				res.send(dbres);
			});
	});

	router.get('/api/project', function (req, res) {
		var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

		pm.getAll(ip, function (dbres) {
			res.send(dbres);
		});
	});

	router.delete('/api/project/:id', function (req, res) {
		pm.remove(req.params.id, function (dbres) {
			res.send(dbres);
		});
	});

	router.post('/api/project/like/:id', function (req, res) {
		var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

		pm.like(req.params.id, ip, function (dbres) {
			res.send(dbres);
		})
	});

	router.post('/api/project/unlike/:id', function (req, res) {
		var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

		pm.unlike(req.params.id, ip, function (dbres) {
			res.send(dbres);
		})
	});
	/** END Project API */
	return router;
}