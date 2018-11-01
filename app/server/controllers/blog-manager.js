var mongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var ISODate = require('mongodb').ISODate;

process.env.DB_URL = 'mongodb://localhost:27017/';
process.env.DB_NAME = 'personal-website';

module.exports = {
	post: function(blogObj, callback) {
		blogObj.created = (new Date()).toISOString();
		mongoClient.connect(process.env.DB_URL, function(err, db){
			if(err) throw err;
			var dbo = db.db(process.env.DB_NAME);
			var obj = blogObj;
			dbo.collection('blogs').insertOne(obj, function(err, res){
				if(err) throw err;
				db.close();
				callback(res);
			});
		});
	},

	getAll: function(callback){
		mongoClient.connect(process.env.DB_URL, {useNewUrlParser: true}, function(err, db){
			if(err) throw err;
			var dbo = db.db(process.env.DB_NAME);
			dbo.collection('blogs').find().toArray(function(err, res){
				if(err) throw err;
				db.close();
				callback(res);
			});
		});
	},

	getOne: function(id, callback){
		mongoClient.connect(process.env.DB_URL, {useNewUrlParser: true}, function(err, db){
			if(err) throw err;
			var dbo = db.db(process.env.DB_NAME);
			dbo.collection('blogs').findOne({_id: id}, function(err, res){
				if(err) throw err;
				db.close();
				callback(res)
			});
		});
	},

	remove: function(id, callback){
		mongoClient.connect(process.env.DB_URL, {useNewUrlParser: true}, function(err, db){
			if(err) throw err;
			var dbo = db.db(process.env.DB_NAME);
			dbo.collection('blogs').findOneAndDelete({_id:ObjectId(id)}, function(err, res){
				if(err) throw err;
				db.close();				
				callback(res);
			});
		});
	}
}

