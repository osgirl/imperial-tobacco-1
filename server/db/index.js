const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017/imperial-tobacco';

module.exports.connect = async function() {
	let client = await MongoClient.connect(url);
	client = client.db('imperial-tobacco');
	return client;
};