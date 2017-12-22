module.exports = class Account {
	constructor(db) {
		this.db = db;
	}

	async getAllPlatforms() {
		const pipeline = require('./getAllPlatforms.pipeline.js');
		return await this.db.collection('items').aggregate(pipeline).toArray();
	}

	async getBrandsByFilter(platform, month, year) {
		const pipeline = require('./getBrandsByFilter.pipeline.js')(platform, month, year);
		return await this.db.collection('items').aggregate(pipeline).toArray();
	}
};