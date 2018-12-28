var mongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

process.env.DB_URL = 'mongodb://localhost:27017/';
process.env.DB_NAME = 'personal-website';


module.exports = function (collectionName) {
	var module = {
		insertOne: function(collection, obj, cb){
			obj.created = (new Date()).toISOString();
			mongoClient.connect(process.env.DB_URL, { useNewUrlParser: true }, function (err, db) {
				if (err) throw err;
				var dbo = db.db(process.env.DB_NAME);
				
				dbo.collection(collection).insertOne(obj, function (err, res) {
					if (err) throw err;
					db.close();
					if(cb) cb(res);
				});
			});
		},

		post: function (obj, callback) {
			obj.created = (new Date()).toISOString();
			mongoClient.connect(process.env.DB_URL, { useNewUrlParser: true }, function (err, db) {
				if (err) throw err;
				var dbo = db.db(process.env.DB_NAME);
				
				dbo.collection(collectionName).insertOne(obj, function (err, res) {
					if (err) throw err;
					db.close();
					callback(res);
				});
			});
		},

		update: function (id, blogObj, callback) {
			blogObj.updated = (new Date()).toISOString();
			mongoClient.connect(process.env.DB_URL, { useNewUrlParser: true }, function (err, db) {
				if (err) throw err;
				var dbo = db.db(process.env.DB_NAME);
				var obj = blogObj;
				dbo.collection(collectionName).updateOne({ _id: ObjectId(id) },
					{ $set: obj },
					function (err, res) {
						if (err) throw err;
						db.close();
						if (callback) callback(res);
					});
			});
		},

		getSkills: function(callback)
		{
			mongoClient.connect(process.env.DB_URL, {useNewUrlParser: true}, function(err, db){
				if(err) throw err;
				var dbo = db.db(process.env.DB_NAME);
				dbo.collection('categories').aggregate(
					[{$lookup:
				       {
				         from: 'skills',
				         localField: '_id',
				         foreignField: 'cat',
				         as: 'items'
					   }
					}])
					.toArray(function(dberr, dbres){
					if(dberr) throw dberr;
					db.close();
					callback(dbres);
				});
			});
		},

		find: function(uip, callback){
			mongoClient.connect(process.env.DB_URL, {useNewUrlParser: true}, function(err, db){
				if(err) throw err;
				var dbo = db.db(process.env.DB_NAME);
				dbo.collection(collectionName).find().toArray(function(err, res){
					if(err) throw err;
					db.close();
					if(callback)
						callback(res);
				});
			});
		},
		
		findById: function(collection, id, cb){
			mongoClient.connect(process.env.DB_URL, {useNewUrlParser: true}, function(err, db){
				if(err) throw err;
				var dbo = db.db(process.env.DB_NAME);
				dbo.collection(collection).find({_id:id}).toArray(function(err, res){
					if(err) throw err;
					db.close();
					if(cb)
						cb(res);
				});
			});
		},

		getAllFrom: function(collection, cb){
			mongoClient.connect(process.env.DB_URL, {useNewUrlParser: true}, function(err, db){
				if(err) throw err;
				var dbo = db.db(process.env.DB_NAME);
				dbo.collection(collection).find().toArray(function(err, res){
					if(err) throw err;
					db.close();
					if(cb) cb(res);
				});
			});
		},

		/**
		 * Rename this since it aggregares likes
		 * @uip 
		 * @sort sort object
		 */
		getAll: function (uip, sort, callback) {

			mongoClient.connect(process.env.DB_URL, { useNewUrlParser: true }, function (err, db) {
				if (err) throw err;
				var dbo = db.db(process.env.DB_NAME);
				dbo.collection(collectionName)
					.aggregate([{
						$addFields: { 
							liked: { $in: [uip, { $ifNull: ["$likes.ip", []] }] },
							numOfLikes: { $size: { "$ifNull": ["$likes", []] } }
						}
					}])
					.sort(sort).toArray(function (err, res) {
						if (err) throw err;
						db.close();
						callback(res);
					});
			});
		},

		getOne: function (id, callback) {
			mongoClient.connect(process.env.DB_URL, { useNewUrlParser: true }, function (err, db) {
				if (err) throw err;
				var dbo = db.db(process.env.DB_NAME);
				dbo.collection(collectionName).findOne({ _id: ObjectId(id) }, function (err, res) {
					if (err) throw err;
					db.close();
					callback(res)
				});
			});
		},

		remove: function (id, callback) {
			mongoClient.connect(process.env.DB_URL, { useNewUrlParser: true }, function (err, db) {
				if (err) throw err;
				var dbo = db.db(process.env.DB_NAME);
				dbo.collection(collectionName).findOneAndDelete({ _id: ObjectId(id) }, function (err, res) {
					if (err) throw err;
					db.close();
					callback(res);
				});
			});
		},

		like: function (id, uip, cb) {
			mongoClient.connect(process.env.DB_URL, { useNewUrlParser: true }, function (err, db) {
				if (err) throw err;
				var dbo = db.db(process.env.DB_NAME);
				dbo.collection(collectionName).findOneAndUpdate(
					{ _id: ObjectId(id) },
					{ $addToSet: { likes: { ip: uip, on: (new Date()).toISOString() } } },
					{
						projection: { likes: 1 },
						returnOriginal: false
					},
					function (err, res) {
						if (err) throw err;
						db.close();
						cb(res.value);
					}
				);

			});
		},

		unlike: function (id, uip, cb) {
			mongoClient.connect(process.env.DB_URL, { useNewUrlParser: true }, function (err, db) {
				if (err) throw err;
				var dbo = db.db(process.env.DB_NAME);
				dbo.collection(collectionName).findOneAndUpdate(
					{ _id: ObjectId(id) },
					{ $pull: { likes: { ip: uip } } },
					{
						projection: { likes: 1 },
						returnOriginal: false
					},
					function (err, res) {
						if (err) throw err;
						db.close();
						cb(res.value);
					}
				);

			});
		},

		comment: function (id, uip, msg, cb) {
			mongoClient.connect(process.env.DB_URL, { useNewUrlParser: true }, function (err, db) {
				if (err) throw err;
				var dbo = db.db(process.env.DB_NAME);
				dbo.collection(collectionName).findOneAndUpdate(
					{ _id: ObjectId(id) },
					{ $addToSet: { comments: { ip: uip, on: (new Date()).toISOString(), message : msg } } },
					{
						projection: { comments: 1 },
						returnOriginal: false
					},
					function (err, res) {
						if (err) throw err;
						db.close();
						cb(res.value);
					}
				);

			});
		},
	}
	return module;
}