const express = require('express');
const session = require('express-session');
const path = require('path');
// const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const MongoDBStore = require('connect-mongodb-session')(session);
const cors = require('cors');
const passport = require('passport');
const fs = require('fs');
const config = require('../config');
const DB = require('./db/index');

const {engines} = require('./../package.json');

const engineVersion = engines.node;

// require('./extensions/object-extensions');

if (process.version !== engineVersion) {
	console.error('***************************************************************************');
	console.error(`* Required node version ${engineVersion} not satisfied with current version ${process.version}. *`);
	console.error('***************************************************************************');
	process.exit(1);
}

const AccountRep = require('./repositories/account');

const app = express();

(async function () {
	app.use(cors());
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: false}));
	app.use(cookieParser());

	let store = new MongoDBStore({
		uri: 'mongodb://localhost:27017/imperial-tobacco',
		collection: 'sessions'
	});
	app.use(require('express-session')({
		secret: config.get('sessionSecret'),
		cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
		store: store,
		resave: false,
		saveUninitialized: false
	}));
	// const sessionStore = new pgSession({
	// 	pool     : DB._pool,
	// 	tableName: 'session'
	// });
	// app.use(session({
	// 	store            : sessionStore,
	// 	secret           : config.get('sessionSecret'),
	// 	resave           : false,
	// 	saveUninitialized: false,
	// 	cookie           : {maxAge: 30 * 24 * 60 * 60 * 1000} // 30 days
	// }));


	app.use(async function (req, res, next) {
		req.db = await DB.connect();
		next();
	});

	app.use(express.static(path.join(__dirname, '../client/dist')));

	app.use(passport.initialize());
	app.use(passport.session());

	passport.serializeUser(function (user, done) {
		done(null, user);
	});

	passport.deserializeUser(async function (user, done) {
		done(null, user);
	});

	const LocalStrategy = require('./logic/auth-strategies/local-strategy');
	passport.use(LocalStrategy(require('passport-local').Strategy));

	//TODO Routes
	const router = require('express-promise-router')();
	app.use(require('./routes/account')(router));


	let debug = require('debug')('upwork:server');
	app.use(function(req, res, next) {
		// res.sendFile('index.html', {root: 'client/dist/'});
	});


	app.use(function errorHandler(err, req, res, next) {
		console.error(err.stack);
		res.send(500, err.stack);
	});




	let http = require('http');

	let port = config.get('port') || '3002';
	app.set('port', port);
	let server = http.createServer(app);

	server.listen(Number(port));
	server.on('listening', function onListening() {
		debug('Listening on ' + port);
	});

	server.on('error', function onError(error) {
		switch (error.code) {
			case 'EACCES':
				console.error(port + ' requires elevated privileges');
				process.exit(1);
				break;
			case 'EADDRINUSE':
				console.error(port + ' is already in use');
				process.exit(1);
				break;
			default:
				throw error;
		}
	});
})().catch(err => console.error(err.stack));

