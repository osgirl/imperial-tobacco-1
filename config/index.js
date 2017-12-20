let convict = require('convict');
const conf = convict({
	env: {
		doc    : "The App Environment",
		default: "dev",
		env    : "NODE_ENV"
	},
	isDev: {
		format : 'Boolean',
		default: true
	},
	isProd: {
		format : 'Boolean',
		default: false
	},
	host: {
		format : 'url',
		default: 'http://localhost:8080'
	},
	port: {
		format : 'port',
		default: 3000
	},
	username: {
		format : 'String',
		default: 'admin'
	},
	password: {
		format : 'String',
		default: 'admin'
	},
	db: {
		user: {
			format : 'String',
			default: 'postgres'
		},
		host: {
			format : 'String',
			default: 'localhost'
		},
		database: {
			format : 'String',
			default: 'aisales'
		},
		password: {
			format : 'String',
			default: '12345'
		},
		port: {
			format : 'String',
			default: '5432'
		},
		maxConnections: {
			format : 'Number',
			default: '10'
		},
		minConnections: {
			format : 'Number',
			default: '2'
		},
		idleTimeoutMillis: {
			format : 'Number',
			default: '1000'
		}
	},
	sessionSecret: {
		format : 'String',
		default: 'Killer Is Jim'
	}
});

let env = conf.get('env');
conf.loadFile(`./config/configs/${env}.json`);

conf.validate({ allowed: 'strict' });

module.exports = conf;
