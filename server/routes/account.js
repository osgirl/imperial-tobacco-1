const passport = require('passport');
const fs = require('fs');
let PDFDocument = require('pdfkit');
let excel = require('excel4node');
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

	router.get('/getNamesByFilter', async function (req, res, next) {
		let platform = req.query.platform;
		let month = +req.query.month;
		let year = +req.query.year;

		let brands = await new AccountLogic(new AccountRep(req.db)).getNamesByFilter(platform, month, year);
		
		res.json(brands);
	});

	router.post('/excel', function(req, res, next) {

		function strip_html_tags(str) {
			if ((str===null) || (str==='')) return false;
			else str = str.toString();
			return str.replace(/<[^>]*>/g, '');
		}

		let data = req.body.data;

		let workbook = new excel.Workbook();

		let worksheet = workbook.addWorksheet('Sheet 1');
		let myStyle = workbook.createStyle({
			font: {
				bold: true
			}, 
			alignment: {
				wrapText: true,
				horizontal: 'center',
				vertical: 'center'
			}
		});
		let wrap = workbook.createStyle({
			font: {
				size: 12
			},
			alignment: {
				wrapText: true
			}
		})

		let row = 1;
		for(let i = 0; i < data.length; i++) {

			let current = data[i];
			// console.log(current.name)
			worksheet.cell(row, 1).string('Brand').style(myStyle);
			worksheet.cell(row, 2).string(`${current.name}`);

			row++;
			
			let descr = strip_html_tags(current.description);

			worksheet.row(row).setHeight(120);
			worksheet.cell(row, 1).string('Description').style(myStyle);;
			worksheet.cell(row, 2, row, 8, true).string(`${descr}`).style(wrap);

			row += 2;

			worksheet.cell(row, 1).string('Code').style(myStyle);
			worksheet.cell(row, 2).string('Name').style(myStyle);
			worksheet.cell(row, 3).string('Length').style(myStyle);
			worksheet.cell(row, 4).string('Ring').style(myStyle);
			worksheet.cell(row, 5).string('Shade').style(myStyle);
			worksheet.cell(row, 6).string('Quantity').style(myStyle);
			worksheet.cell(row, 7).string('MSRP').style(myStyle);
			worksheet.cell(row, 8).string('Jrprice').style(myStyle);
			row++;

			current.items.forEach(function(element) {
				worksheet.cell(row, 1).string(`${element.code}`);
				worksheet.cell(row, 2).string(`${element.name}`);
				worksheet.cell(row, 3).string(`${element.length}`);
				worksheet.cell(row, 4).string(`${element.ring}`);
				worksheet.cell(row, 5).string(`${element.wrapper_shade}`);
				worksheet.cell(row, 6).string(`${element.quantity}`);
				worksheet.cell(row, 7).string(`${element.msrp}`);
				worksheet.cell(row, 8).string(`${element.jr_price}`);
				row++;
			}, this);

			row += 2;
		}

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
