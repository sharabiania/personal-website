var pm = require('../controllers/db-manager')('projects');

module.exports = function (loggedIn) {
	var router = require('express').Router();
	/** Project Views */
	router.get('/',
		function (req, res) {
			var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

			pm.getAll(ip, function (dbres) {
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

	router.get('/create',
		loggedIn,
		function (req, res) {
			res.render('proj/proj-create');
		});

	router.get('/update/:id',
		// TODO:	loggedIn,
		function (req, res) {
			pm.getOne(req.params.id, function (dbres) {
				res.render('proj/proj-update', { b: dbres });
			});

		});
	/** END Project Views */


	// NOTE: this is a form/multipart request not a JSON api call.
	router.post('/', function (req, res) {

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
			'images': [{ 'path': uploadPath, 'uri': '/' + uploadsFolderName + '/' + fileName }]
		};
		pm.post(obj, function (dbres) {
			res.redirect('/project');
		});

	});

	return router;
}