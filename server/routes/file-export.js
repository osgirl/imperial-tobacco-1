const DataRep = require('../repositories/data');
const DataLogic = require('../logic/data/index');
const FileExportLogic = require('../logic/file-export/index');


module.exports = function (router) {
	router.post('/excel', async function(req, res, next) {
		let data = req.body.data;
		let codes = req.body.codes;
		let platform = req.body.platform;
		let month = +req.body.month;
		let year = +req.body.year;

		const dataLogic = new DataLogic(new DataRep(req.db));

		let allItems = await dataLogic.getEverythingByBrandnames(data, codes, platform, month, year);

		let workbook = new FileExportLogic().getExcelFile(allItems);

		workbook.write('data.xlsx', function(err, stats) {
			res.sendFile('data.xlsx', {root: './'});
		});
	});
	
	return router;
};
