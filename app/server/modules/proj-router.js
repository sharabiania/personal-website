var pm = require('../controllers/db-manager')('projects');
var protected = require('../modules/auth').protectView;

module.exports = (function () {
	var router = require('express').Router();
	/** Project Views */
	router.get('/',
		function (req, res) {
			var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

			pm.getAll(ip, {order:1, created:-1}, function (dbres) {
				var preview = false;
				if (req.query.p == 1) {
					preview = true;
				}
				if (req.user) {
					if (preview) {
						res.render('proj/proj-preview', { 'projs': dbres, 'authenticated': true, 'preview': true });
					}
					else
						res.render('proj/proj-manage', { 'projs': dbres, 'authenticated': true });
				}
				else
					res.render('proj/proj-preview', { 'projs': dbres, 'authenticated': false, 'preview': false });
			});

		});

	router.get('/create', protected,
		function (req, res) {
			res.render('proj/proj-create');
		});

	router.get('/update/:id', protected,
		function (req, res) {
			pm.getOne(req.params.id, function (dbres) {
				res.render('proj/proj-update', { proj: dbres });
			});

		});
	/** END Project Views */


	// NOTE: this is a form/multipart request not a JSON api call.
	router.post('/', protected, function (req, res) {

		var imageFile = req.files.image;
		var uploadsFolderName = 'uploads'
		var fileName = imageFile.name;
		// TODO: IMPORTANT get the path to the app folder instead of doing /../../
		var uploadDir = __dirname + '/../../public/' + uploadsFolderName + '/';
		uploadPath = uploadDir + fileName;
		var fs = require('fs');
		if (!fs.existsSync(uploadDir))
			fs.mkdirSync(uploadDir);

		imageFile.mv(uploadPath, function (err) {
			if (err) {
				return res.status(500).send(err);
			}
		});
		var obj = {
			'title': req.body.title,
			'desc': req.body.desc,
			'images': [{ 'path': uploadPath, 'uri': '/' + uploadsFolderName + '/' + fileName }],
			'order':req.body.order || 0
		};
		pm.post(obj, function (dbres) {
			res.redirect('/project');
		});

	});

	router.post('/update/:id', protected, function (req, res) {
		var obj = {
			'title': req.body.title,
			'desc': req.body.desc,
			'order': req.body.order || 0
		};
		if(req.files.image) {
			var imageFile = req.files.image;
			var uploadsFolderName = 'uploads'
			var fileName = imageFile.name;
			// TODO: IMPORTANT get the path to the app folder instead of doing /../../
			var uploadDir = __dirname + '/../../public/' + uploadsFolderName + '/';
			uploadPath = uploadDir + fileName;
			var fs = require('fs');
			if (!fs.existsSync(uploadDir))
				fs.mkdirSync(uploadDir);

			imageFile.mv(uploadPath, function (err) {
				if (err) {
					return res.status(500).send(err);
				}
			});
			obj.images = [{ 'path': uploadPath, 'uri': '/' + uploadsFolderName + '/' + fileName }];
		}
		pm.update(req.params.id, obj, function (dbres) {
			res.redirect('/project');
		});

	});

	return router;
})();