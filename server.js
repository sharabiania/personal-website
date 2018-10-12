var express = require('express');
var app = express();
var port = process.env.port || 1337;
var mongo = require('mongodb').MongoClient;
var config = require('./config.json');
var ObjectId = require('mongodb').ObjectID;


// routes to serve the static HTML files
app.get('/', function(req, res){ res.sendFile('index.html', {root: __dirname});});

app.use('/public', express.static(__dirname + '/public'));
app.use(express.json())

app.listen(port, function(){console.log("Server running on port: " + port + " started at: " + new Date());});


/** Rest API */
app.get("/api/blog", function(req, res){
    mongo.connect(config.dburl, {useNewUrlParser: true },function(err, db){
        if(err) throw err;
        var dbo = db.db(config.dbname);
        dbo.collection("blogs").find().toArray(function(err, result){
            if(err) throw err;
            db.close();
            res.send(result);
        });
    });
});

app.post("/api/blog", function(req, res){
    mongo.connect(config.dburl, {useNewUrlParser: true }, function(err, db){
        if(err) throw err;
        var dbo = db.db(config.dbname);
        dbo.collection("blogs").insertOne(req.body, function(err, result){
            if(err) throw err;
            db.close();
            temp = JSON.parse(result);
            temp.data = result.ops[0];
            res.send(temp);
        });
    });
});

app.delete('/api/blog/:id', function(req, res){
    console.log('id:', req.params.id);
    mongo.connect(config.dburl, {useNewUrlParser: true}, function(err, db){
        if(err) throw err;
        var dbo = db.db(config.dbname);
        dbo.collection("blogs").deleteOne({"_id": ObjectId(req.params.id) }, function(err, result){
            if(err) throw err;
            db.close();
            console.log(result);
            res.send(result);
        })
    });
    
});
