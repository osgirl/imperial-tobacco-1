import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'unique'
})

export class Unique implements PipeTransform {
	transform(filteredArray: Array<any>): any {
		if(!filteredArray) return filteredArray;

		let brands = filteredArray;
		let uniqueBrands: any[] = [];

		brands.forEach((brand) => {
			if(!uniqueBrands.find(x => x.name === brand.name)) uniqueBrands.push(brand);
		})

		return uniqueBrands;
	}
}