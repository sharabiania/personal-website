var mongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;


process.env.DB_URL = 'mongodb://localhost:27017/';
process.env.DB_NAME = 'personal-website';

exports.findByUsername = function(username, cb) {
	mongoClient.connect(process.env.DB_URL, {useNewUrlParser: true}, function(err, db){
		if(err) throw err;
		var dbo = db.db(process.env.DB_NAME);
		dbo.collection('users').findOne({username: username}, function(dberr, dbres){
			db.close();
			if(dberr) throw dberr;			
			cb(dberr, dbres);
		});
	});
}

exports.findUserById = function(id, cb) {
	mongoClient.connect(process.env.DB_URL, {useNewUrlParser: true}, function(err, db){
		if(err) throw err;
		var dbo = db.db(process.env.DB_NAME);
		dbo.collection('users').findOne({_id:ObjectId(id)}, function(dberr, dbres){
			db.close();
			cb(dberr, dbres);
		});
	});
}

exports.findContent = function(id, cb) {
	mongoClient.connect(process.env.DB_URL, {useNewUrlParser: true}, function(err, db){
		if(err) throw err;
		var dbo = db.db(process.env.DB_NAME);
		dbo.collection('content').findOne({_id:id}, function(dberr, dbres){
			db.close();
			if(dberr) throw dberr;
			cb(dbres);
		});
	});
}

exports.upsertContent = function(id, obj, cb){
	mongoClient.connect(process.env.DB_URL, {useNewUrlParser: true}, function(err, db){
		if(err) throw err;
		var dbo = db.db(process.env.DB_NAME);
		dbo.collection('content').updateOne({_id:id}, {$set: obj}, {upsert : true}, function(dberr, dbres){
			db.close();
			if(dberr) throw dberr;
			if(cb) cb(dbres);
		});
	});
}