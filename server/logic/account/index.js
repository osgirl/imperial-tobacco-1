const config = require('../../../config/index');


module.exports = class Account {
	constructor(rep) {
		this.accountRep = rep;
	}

	async getAllPlatforms() {
		let platforms = await this.accountRep.getAllPlatforms();

		return platforms.map((platform) => {
			return platform._id;
		});
	}

	async getBrandsByFilter(platform, month, year) {
		let brands = await this.accountRep.getBrandsByFilter(platform, month, year);
		return brands;
		
		// return brands.map((brand, index) => {
		// 	return {
		// 		id: index,
		// 		selected: false,
		// 		name: brand._id,
		// 		description: brand.description
		// 	};
		// });
	}

	async getNamesByFilter(platform, month, year) {
		let items = await this.accountRep.getNamesByFilter(platform, month, year);
		
		return items;
	}

	async getEverythingByBrandnames(brandNames) {
		let items = await this.accountRep.getEverythingByBrandnames(brandNames);
		return items;
	}
	
};