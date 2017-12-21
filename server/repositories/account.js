module.exports = class Account {
	constructor(db) {
		this.db = db;
	}

	async getAllPlatforms() {
		const pipeline = require('./getAllPlatforms.pipeline.js');
		return await this.db.collection('items').aggregate(pipeline).toArray();
	}

	async getBrandsByFilter(platform, month) {
		const pipeline = require('./getBrandsByFilter.pipeline.js')(platform, month);
		return await this.db.collection('items').aggregate(pipeline).toArray();
	}
};