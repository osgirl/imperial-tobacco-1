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
	sync: {
		format : 'Boolean',
		default: false
	},
	testEmailRecepients: {
		format : 'email',
		default: 'nastia.15@inbox.ru'
	},
	fromEmail: {
		format : 'String',
		default: 'Aisales Smith 👻  <foo@blurdybloop.com>'
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
	vk: {
		clientID: {
			format : 'String',
			default: '6241270'
		},
		clientSecret: {
			format : 'String',
			default: 'tzHYK4wsvHN10J7mur7G'
		},
		callbackURL: {
			format : 'url',
			default: 'http://localhost:8080/auth/vkontakte/callback'
		}
	},
	facebook: {
		clientID: {
			format : 'String',
			default: '296431980857078'
		},
		clientSecret: {
			format : 'String',
			default: '7a317d23b1505574ab2553e1c29783cb'
		},
		callbackURL: {
			format : 'String',
			default: 'http://localhost:8080/auth/facebook/callback'
		}
	},
	linkedIn: {
		clientID: {
			format : 'String',
			default: '86brdl3biarln2'
		},
		clientSecret: {
			format : 'String',
			default: 'EAxnZWCTsMYdqzlR'
		},
		callbackURL: {
			format : 'url',
			default: 'http://localhost:8080/auth/linkedin/callback'
		}
	},
	smtp: {
		host: {
			format : 'url',
			default: 'smtp.gmail.com'
		},
		port: {
			format : 'Number',
			default: 587
		},
		secure: {
			format : 'Boolean',
			default: false
		},
		auth: {
			user: {
				format : 'email',
				default: 'aisales.smith.testacc@gmail.com'
			},
			pass: {
				format : 'String',
				default: 'aisalessmith1120'
			}
		}
	},
	bot: {
		secret: {
			format : 'String',
			default: '$ecret1'
		},
		url: {
			format : 'url',
			default: 'https://upwork.aisales.aisnovations.com'
		},
		seneca: {
			active: {
				format : 'Boolean',
				default: false
			},
			type: {
				format : 'String',
				default: 'tcp'
			},
			host: {
				format : 'ipaddress',
				default: '127.0.0.1'
			},
			port: {
				format : 'port',
				default: 8085
			}
		},
		sync: {
			format : 'Boolean',
			default: 'false'
		},
		syncInterval: {
			format : 'Number',
			default: '60000'
		},
		syncKey: {
			format : 'String',
			default: 'test'
		}
	},
	upwork: {
		accounts: [{
			name: {
				format : 'String',
				default: 'AIS'
			},
			id: {
				format : 'String',
				default: '648017980555083776'
			}
		}]
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
