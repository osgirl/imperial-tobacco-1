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

	async getBrandsByFilter(platform, month) {
		let brands = await this.accountRep.getBrandsByFilter(platform, month);
		return brands;
		// return brands.map((brand) => {
		// 	return brand.name;
		// });
	}
};