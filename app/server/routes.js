var bm = require('./controllers/blog-manager');
module.exports = function(app) {


    app.get('/', function (req, res) {
        res.render('index', { title: 'Hey', message: 'Hello there!' });
	});
	  
    app.get('/login', function(req, res){
        res.render('login');
	})
	
	app.get('/blog', function(req, res){
		bm.getAll(function(dbres){
			console.log(dbres[0].title);
			res.render('blog', {'blogs':dbres});
		});
		
	});

	app.get('/blog/create', function(req, res){
		res.render('blog-create');
	});

	app.post('/api/blog', function(req, res){
		bm.post({'title':req.body.title, 'desc': req.body.desc}, 
		function(dbres){
			res.send(dbres);
		});
		
	});

	app.get('/api/blog', function(req, res){
		bm.getAll(function(dbres){
			res.send(dbres);
		});
	});

	app.delete('/api/blog/:id', function(req, res){
		bm.remove(req.params.id, function(dbres){			
			res.send(dbres);
		});
	});
}