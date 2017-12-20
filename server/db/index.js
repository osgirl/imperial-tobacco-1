const {Pool} = require('pg');
const config = require('../../config/index');
const named = require('node-postgres-named');
const debug = require('debug')('upwork:database');

const pool = new Pool({
	user    : config.get('db.user'),
	host    : config.get('db.host'),
	database: config.get('db.database'),
	password: config.get('db.password'),
	port    : config.get('db.port'),

	max              : config.get('db.maxConnections') || 10,
	min              : config.get('db.minConnections') || 2,
	idleTimeoutMillis: config.get('db.idleTimeoutMillis') || 1000
});

pool.on('error', function (err, client) {
	debug(`idle client error: ${err.message} ${err.stack}`);
});

named.patch(pool);
module.exports._pool = pool;

module.exports.query = pool.query.bind(pool);

module.exports.connect = async function () {
	let client = await pool.connect();
	named.patch(client);
	return client;
};