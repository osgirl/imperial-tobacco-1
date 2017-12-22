const passport = require('passport');
// const { ReqAccess } = require('../logic/secure');
const AccountRep = require('../repositories/account');
const AccountLogic = require('../logic/account/index');
// const DB = require('../db/index');
const config = require('../../config');
// const email = require('../email');

module.exports = function (router) {
	router.get('/isAuth', async function (req, res, next) {
		if (req.session.passport) {
			res.json({ isAuth: true });
		} else {
			res.json({ isAuth: false });
		}
	});

	router.post('/login', function (req, res, next) {
		passport.authenticate('local', function (err, user, info) {
			if (err) {
				next(err);
			}

			if (!user) {
				return res.json({
					success: false,
					message: info
				});
			}

			req.logIn(user, function (err) {
				if (err) {
					console.log('error while log in', err);
					return next(err);
				}

				return res.json({
					success: true
				});
			});
		})(req, res, next);
	});

	router.post('/logout', function (req, res) {
		req.session.destroy(function (err) {
			if (err) {
				res.json({
					success: false,
					msg: err
				});
			}  else
				res.json({
					success: true
				});
		});
	});


	router.get('/error', function (req, res, next) {
		res.sendFile('error.html', { root: './server/views' });
	});

	router.get('/getAllPlatforms', async function (req, res, next) {
		let platforms = await new AccountLogic(new AccountRep(req.db)).getAllPlatforms();
		
		res.json(platforms);
	});

	router.get('/getBrandsByFilter', async function (req, res, next) {
		let platform = req.query.platform;
		let month = +req.query.month;
		let year = +req.query.year;

		let brands = await new AccountLogic(new AccountRep(req.db)).getBrandsByFilter(platform, month, year);
		
		res.json(brands);
	});
	
	return router;
};
