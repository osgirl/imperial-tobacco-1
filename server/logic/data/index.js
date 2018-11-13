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

		// items.forEach((element) => {
		for (let j = 0; j < items.length; j++) {
			let element = items[j];

			// save copy of array to another field
			element.codes = element.code.slice();

			if (element.code.length > 1) {
				element.code = element.code.sort((a, b) => a.length - b.length)[0];
			} else {
				element.code = element.code[0];
			}

			if (element.shade.length > 1) {
				element.shade = element.shade.sort().join('/');
			}
			// });
		}

		return items;
	}

	async getEverythingByBrandnames(brandNames, codes, platform, month, year) {
		let brands = await this.dataRep.getEverythingByBrandnames(brandNames, codes, platform, month, year);

        let logged = false;
		brands.forEach((brand) => {

			console.log(brand.items[0]);

			brand.items.forEach((element) => {
				if (element.code.length > 1) {
					element.code = element.code.sort((a, b) => a.length - b.length)[0];
				} else {
					element.code = element.code[0];
				}

				if (element.shade.length > 1) {
					element.shade = element.shade.sort().join('/');
				}
			});

		});

		return brands;
	}


	async getSKUList(platform) {
		let brands = await this.dataRep.getSKUList(platform);

		return brands;
	}

	async getAllItemsByFilter(platform, platformPrice, selectedByDefault) {
		let items = await this.dataRep.getAllItemsByFilter(platform, platformPrice);
		items.map((item, index) => {
			item.code = item.code[0];
			item.packaging_type = {
				text: `${item.packaging_type}`,
				value: this.getIndex(item.packaging_type)
			};
			item.selected = selectedByDefault;
		});
		return items;
	}

	getIndex(type) {
		switch (type) {
			case null: return 1;
			case 'other': return 2;
			case 'box': return 3;
			case 'bundle': return 4;
			case 'single': return 5;
			case 'pack': return 6;
			case 'tin': return 7; 
		}
	}
};