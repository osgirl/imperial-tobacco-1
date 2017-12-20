module.exports = (Strategy) => {
	return new Strategy({
		passReqToCallback: true
	}, async function (req, username, password, done) {
		try {
			let user = {
				username, password
			};
			
			if (username === "admin" && password === "admin") {
				return done(null, user);
			} else {
				return done(null, false, 'Incorrect username or password');
			}
		} catch (err) {
			done(err);
		}
	});
};
