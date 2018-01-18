const MongoClient = require('mongodb').MongoClient;
const dbConfig = require('../../config').get('db');

const url = `mongodb://${dbConfig.host}:${dbConfig.port}`;

module.exports.connect = async function() {
	let client = await MongoClient.connect(url);
	client = client.db(`${dbConfig.database}`);
	return client;
};