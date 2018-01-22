const MongoClient = require('mongodb').MongoClient;
const dbConfig = require('../../config').get('db');
const isProd = require('../../config').get('isProd');

const url = isProd ? `mongodb://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/?authMechanism=DEFAULT&authSource=${dbConfig.database}` : `mongodb://${dbConfig.host}:${dbConfig.port}`;

module.exports.connect = async function() {
	let client = await MongoClient.connect(url);
	client = client.db(`${dbConfig.database}`);
	return client;
};