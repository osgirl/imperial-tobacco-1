const fs = require('fs');
require.extensions['.sql'] = (module, filename) => {module.exports = fs.readFileSync(filename, 'utf8');};
require.extensions['.html'] = (module, filename) => {module.exports = fs.readFileSync(filename, 'utf8');};

// const {Client} = require('pg');
// const _config = require('../config').get('db');
const isProd = require('../config').isProd;
const DB = require('../server/db');
// const query = db.query;
// const DB = require('./db/index');

let modules = [
	require('./migrations/add_random_data_to_items'),
	require('./migrations/add_five_pack_price'),
	require('./migrations/add_SKU_collection')
];

const {engines} = require('./../package.json');
const engineVersion = engines.node;
if (process.version !== engineVersion) {
	console.error('***************************************************************************');
	console.error(`* Required node version ${engineVersion} not satisfied with current version ${process.version}. *`);
	console.error('***************************************************************************');
	process.exit(1);
}

let db;

(async function () {
	await checkConnection();
	// await createDBIfNotExist();
	await createMigrationsTable();
	try {
		await applyMigrations();
	}
	catch (err) {
		process.exit(1);
	}

})();

async function checkConnection() {
	db = await DB.connect();
	
	// return new Promise((resolve, rej) => {
	// 	async function connectionTry(attempt) {
	// 		try {
	// 			console.log(`${attempt + 1} db check!`);
	// 			await DB.connect();
	// 			resolve();
	// 		} catch (err) {
	// 			if (attempt < 10) {
	// 				setTimeout(() => {
	// 					connectionTry(attempt + 1);
	// 				}, 2000);
	// 			} else {
	// 				process.exit(1);
	// 			}
	// 		}
	// 	}

	// 	connectionTry(0);
	// });
}

async function createDBIfNotExist() {
	const client = new Client({
		user    : _config.user,
		host    : _config.host,
		database: 'postgres',
		password: _config.password,
		port    : _config.port
	});

	await client.connect();
	let dbsResult = await client.query(`SELECT datname FROM pg_database where datname = $1`, [_config.database]);
	if (dbsResult.rows.length === 0) {
		await client.query(`CREATE DATABASE ${_config.database};`);
	}

	client.end();
}

async function createMigrationsTable() {
	let collections = await db.collections();
	
	let collectionNames = collections.map((collection) => {
		return collection.s.namespace.replace('imperial-tobacco.', '');
	});

	if(collectionNames.indexOf('_migrations') == -1) {
		await db.createCollection("_migrations");
	}
}

async function applyMigrations() {
	let changed = false;
	for (let i = 0; i < modules.length; i++) {
		let migration = modules[i];
		

		if (isProd && migration.notForProd) continue;

		if (!(await isMigrationHasBeenApplied(migration.name))) {
			await migration.up(db);
			let now = new Date();

			await db.collection("_migrations").insertOne({ name: migration.name, date: now });

			console.log(`Migration "${migration.name}" has been applied`);
			changed = true;
		}
	}
	if (!changed) {
		console.log(`DB is up to date!`);
	}
	process.exit(0);
}

async function isMigrationHasBeenApplied(name) {
	let result = await db.collection('_migrations').find({name: name}).toArray();
	return Boolean(result.length);
}