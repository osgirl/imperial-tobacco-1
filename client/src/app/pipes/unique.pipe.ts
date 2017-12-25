import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'unique',
	pure: false
})

export class Unique implements PipeTransform {
	transform(filteredArray: Array<any>, alreadyAddedBrands: any[]): any {
		if(!filteredArray) return filteredArray;

		let brands = filteredArray;
		let uniqueBrands: any[] = [];

		brands.forEach((brand) => {
			if(!uniqueBrands.find(x => x.name === brand.name) && !alreadyAddedBrands.find(x => x.name === brand.name)) uniqueBrands.push(brand);
		})

		return uniqueBrands;
	}
}