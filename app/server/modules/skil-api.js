var sm = require('../controllers/db-manager')('skills');
var protected = require('../modules/auth').protectAPI;

module.exports = (function () {

	var router = require('express').Router();
	/** Project API */

	router.put('/api/skill/:id', protected, function (req, res) {
		sm.update(req.params.id,
			{ 'name': req.body.name, 'rate': req.body.rate, 'cat':req.body.cat },
			function (dbres) {
				res.send(dbres);
			});
	});



	router.delete('/api/skill/:id', protected, function (req, res) {
		sm.remove(req.params.id, function (dbres) {
			res.send(dbres);
		});
	});


	/** END Project API */
	return router;
})();