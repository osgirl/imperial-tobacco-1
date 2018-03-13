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
		
		items.forEach((element) => {
			if(element.code.length > 1) {
				element.code = element.code.sort((a, b) => a.length - b.length)[0];
			}

			if(element.shade.length > 1) {
				element.shade = element.shade.sort().join('/');
			}
		});

		return items;
	}

	async getEverythingByBrandnames(brandNames, platform, month, year) {
		let brands = await this.dataRep.getEverythingByBrandnames(brandNames, platform, month, year);

		brands.forEach((brand) => {

			brand.items.forEach((element) => {
				if(element.code.length > 1) {
					element.code = element.code.sort((a, b) => a.length - b.length)[0];
				}
	
				if(element.shade.length > 1) {
					element.shade = element.shade.sort().join('/');
				}
			});

		});

		return brands;
	}
	
};