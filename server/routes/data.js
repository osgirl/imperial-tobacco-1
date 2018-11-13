const DataRep = require('../repositories/data');
const DataLogic = require('../logic/data/index');

module.exports = function (router) {
	router.get('/getAllPlatforms', async function (req, res, next) {
		let platforms = await new DataLogic(new DataRep(req.db)).getAllPlatforms();

		res.json(platforms);
	});

	router.get('/getBrandsByFilter', async function (req, res, next) {
		let platform = req.query.platform;
		let month = +req.query.month;
		let year = +req.query.year;

		let brands = await new DataLogic(new DataRep(req.db)).getBrandsByFilter(platform, month, year);
		let items = await new DataLogic(new DataRep(req.db)).getNamesByFilter(platform, month, year);


		brands.forEach(element => {
			element.items = [];
			items.forEach((item) => {
				if (item.brand_name == element.name) {
					element.items.push(item);
				}
			});
		});

		res.json(brands);
	});

	router.get('/getNamesByFilter', async function (req, res, next) {
		let platform = req.query.platform;
		let month = +req.query.month;
		let year = +req.query.year;

		let items = await new DataLogic(new DataRep(req.db)).getNamesByFilter(platform, month, year);

		res.json(items);
	});

	router.get('/getSKUList', async function (req, res, next) {
		let platform = req.query.platform;

		let list = await new DataLogic(new DataRep(req.db)).getSKUList(platform);

		res.json(list);
	});


	router.get('/excel', function (req, res, next) {
		res.sendFile('data.xlsx', { root: './' });
	});

	router.post('/getAllItemsByFilter', async function (req, res, next) {
		let items = await new DataLogic(new DataRep(req.db)).getAllItemsByFilter(req.body.platform, req.body.platformPrice, req.body.selectedByDefault);
		res.json(items);
	});

	return router;
};
