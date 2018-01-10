module.exports = class Data {
	constructor(rep) {
		this.dataRep = rep;
	}

	async getAllPlatforms() {
		let platforms = await this.dataRep.getAllPlatforms();

		return platforms.map((platform) => {
			return platform._id;
		});
	}

	async getBrandsByFilter(platform, month, year) {
		let brands = await this.dataRep.getBrandsByFilter(platform, month, year);
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
		let items = await this.dataRep.getNamesByFilter(platform, month, year);
		
		return items;
	}

	async getEverythingByBrandnames(brandNames) {
		let items = await this.dataRep.getEverythingByBrandnames(brandNames);
		return items;
	}
	
};