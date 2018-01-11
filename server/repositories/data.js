module.exports = class Data {
	constructor(db) {
		this.db = db;
	}

	async getAllPlatforms() {
		const pipeline = require('./pipelines/getAllPlatforms.pipeline.js');
		return await this.db.collection('items').aggregate(pipeline).toArray();
	}

	async getBrandsByFilter(platform, month, year) {
		const pipeline = require('./pipelines/getBrandsByFilter.pipeline.js')(platform, month, year);
		return await this.db.collection('items').aggregate(pipeline).toArray();
	}

	async getNamesByFilter(platform, month, year) {
		const pipeline = require('./pipelines/getNamesByFilter.pipeline.js')(platform, month, year);
		return await this.db.collection('items').aggregate(pipeline).toArray();
	}

	async getEverythingByBrandnames(brandNames, platform, month, year) {
		const pipeline = require('./pipelines/getEverythingByBrandnames.pipeline.js')(brandNames, platform, month, year);
		return await this.db.collection('items').aggregate(pipeline, {allowDiskUse: true}).toArray();
	}
};