function round(valueExpression, decimals) {
	let multiplier = Math.pow(10, decimals || 0);

	if (multiplier === 1) { // zero decimals
		return {
			$let: {
				vars: {
					valAdjusted: {
						$add: [
							valueExpression,
							{$cond: [{$gte: [valueExpression, 0]}, 0.5, -0.5]}
						]
					}
				},
				in: {
					$subtract: ['$$valAdjusted', {$mod: ['$$valAdjusted', 1]}]
				}
			}
		};
	}

	return {
		$let: {
			vars: {
				valAdjusted: {
					$add: [
						{$multiply: [valueExpression, multiplier]},
						{$cond: [{$gte: [valueExpression, 0]}, 0.5, -0.5]}
					]
				}
			},
			in: {
				$divide: [
					{$subtract: ['$$valAdjusted', {$mod: ['$$valAdjusted', 1]}]},
					multiplier
				]
			}
		}
	};
}


const Platforms = {
	CigarsCom: 'cigars.com',
	SeriousCigars: 'seriouscigars',
	JrCigars: 'jrcigars',
	SantaClaraCigars: 'Santaclaracigars.com'
};

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

		let collection;

		if(platform == Platforms.CigarsCom) {
			collection = this.db.collection('cigars_items');
		} else if (platform == Platforms.JrCigars) {
			collection = this.db.collection('items');
		} else if (platform == Platforms.SeriousCigars || platform == "serious cigars") {
			collection = this.db.collection('serious_items');
		} else if (platform == Platforms.SantaClaraCigars) {
			collection = this.db.collection('santaclara_item');
		} else {
			collection = this.db.collection('items');
		}

		return await collection.aggregate(pipeline).toArray();
	}

	async getNamesByFilter(platform, month, year) {
		const pipeline = require('./pipelines/getNamesByFilter.pipeline.js')(platform, month, year);

		let collection;

		if(platform == Platforms.CigarsCom) {
			collection = this.db.collection('cigars_items');
		} else if (platform == Platforms.JrCigars) {
			collection = this.db.collection('items');
		} else if (platform == Platforms.SeriousCigars || platform == "serious cigars") {
			collection = this.db.collection('serious_items');
		} else if (platform == Platforms.SantaClaraCigars) {
			collection = this.db.collection('santaclara_item');
		} else {
			collection = this.db.collection('items');
		}


		return await collection.aggregate(pipeline).toArray();
	}
	async getAllItemsByFilter(platform, platformPrice) {
		const pipeline = require('./pipelines/getAllItemsByFilter.pipeline.js')(platformPrice);

		let items;
		if (platform === Platforms.CigarsCom) {
			items = await this.db.collection('cigars_items').aggregate(pipeline).toArray();
		} else if (platform === Platforms.SeriousCigars) {
			items = await this.db.collection('serious_items').aggregate(pipeline).toArray();
		} else if (platform === Platforms.JrCigars) {
			items = await this.db.collection('items').aggregate(pipeline).toArray();
		} else if (platform === Platforms.SantaClaraCigars) {
			items = await this.db.collection('santaclara_item').aggregate(pipeline).toArray();
		}

		return items;
	}

	async getEverythingByBrandnames(brandNames, platform, month, year) {
		const pipeline = require('./pipelines/getEverythingByBrandnames.pipeline.js')(brandNames, platform, month, year);
		return await this.db.collection('items').aggregate(pipeline, {allowDiskUse: true}).toArray();
	}

	async getFivePackPriceByCode(code) {
		let reg = new RegExp(`${code}5.*`);
		return await this.db.collection('items').findOne({ code: { $regex: reg } });
	}

	async getSKUList(platform) {
		const pipeline = require('./pipelines/getSKUList.pipeline.js')(platform);
		return await this.db.collection('sku_list').aggregate(pipeline).toArray();
	}
};
