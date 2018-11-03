var http = require('http');
var express = require('express');
var app = express();
var fileUpload = require('express-fileupload');
app.use(fileUpload({
	limits: { fileSize: 50 * 1024 * 1024 },
  }));

// require('./app/server/modules/auth')(app);

app.set('port', process.env.PORT || 4000);
app.set('views', __dirname + '/app/server/views');
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/app/public'));

require('./app/server/modules/routes')(app);

http.createServer(app).listen(app.get('port'), function () {
	console.log('Express server listening on port ' + app.get('port'));
});
