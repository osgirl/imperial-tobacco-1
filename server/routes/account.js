const passport = require('passport');
const fs = require('fs');
let PDFDocument = require('pdfkit');

const AccountRep = require('../repositories/account');
const AccountLogic = require('../logic/account/index');
const FileExportLogic = require('../logic/file-export/index');
const config = require('../../config');

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
			} else
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

	router.get('/getNamesByFilter', async function (req, res, next) {
		let platform = req.query.platform;
		let month = +req.query.month;
		let year = +req.query.year;

		let items = await new AccountLogic(new AccountRep(req.db)).getNamesByFilter(platform, month, year);
		
		res.json(items);
	});

	router.post('/excel', async function(req, res, next) {
		let data = req.body.data;

		// let brandNames = data.map((brand) => {
		// 	return brand.name;
		// });

		// let allItems = await new AccountLogic(new AccountRep(req.db)).getItemsByBrands(data);

		let allItems = await new AccountLogic(new AccountRep(req.db)).getEverythingByBrandnames(data);
		// let all = [];

		// for(let i = 0; i < data.length; i++) {
		// 	let brandName = data[i];

		// 	let element = {};
		// 	element.items = [];
		// 	element.name = brandName;
		// 	element.description = await new AccountLogic(new AccountRep(req.db)).getDescriptionByBrand(brandName);

		// 	allItems.forEach((item) => {
		// 		if (item.brand_name == brandName) {
		// 			element.items.push(item);
		// 		}
		// 	});

		// 	all.push(element);
		// }


		let workbook = new FileExportLogic().getExcelFile(allItems);

		workbook.write('data.xlsx', function(err, stats) {
			res.sendFile('data.xlsx', {root: './'});
		});
	});

	router.post('/pdf', function(req, res, next) {
		let data = req.body.data;


		let doc = new PDFDocument()
		
		doc.pipe(fs.createWriteStream('data.pdf'));

		// doc.font('fonts/PalatinoBold.ttf')
		// 	.fontSize(25)
		// 	.text('Some text with an embedded font!', 100, 100)

		// doc.image('path/to/image.png', {
		// fit: [250, 300],
		// align: 'center',
		// valign: 'center'
		// });

		// doc.addPage()
		// 	.fontSize(25)
		// 	.text('Here is some vector graphics...', 100, 100)

		doc.save()
			.moveTo(100, 150)
			.lineTo(100, 450)

		for(let i = 0; i < data.length; i++) {
			doc.save().fontSize(25).text(data[i].name, 100, i*100)
		}

		// doc.scale(0.6)
		// 	.translate(470, -380)
		// 	.path('M 250,75 L 323,301 131,161 369,161 177,301 z')
		// 	.fill('red', 'even-odd')
		// 	.restore()

		doc.addPage()
			.fillColor("blue")
			.text(JSON.stringify(data), 100, 100)
			.link(100, 100, 160, 27, 'http://google.com/')

		doc.end()

		res.sendFile('data.pdf', {root: './'});
	});
	
	return router;
};
