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
		// return brands;
		
		return brands.map((brand, index) => {
			return {
				id: index,
				selected: false,
				name: brand._id,
				description: brand.description
			};
		});
	}

	async getNamesByFilter(platform, month, year) {
		let items = await this.accountRep.getNamesByFilter(platform, month, year);
		
		return items.map((item, index) => {
			return {
				name: item._id.name,
				length: item._id.length,
				ring: item._id.ring,
				quantity: item._id.quantity,
				msrp: item._id.msrp,
				jr_price: item._id.jr_price,
				code: item.codes.join('/'),
				shade: item.shades.join('/'),
				brand_name: item._id.brand_name
			}	
		});
	}
};