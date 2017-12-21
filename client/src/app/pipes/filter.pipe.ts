import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'filter'
})

export class SearchFilter implements PipeTransform {
	transform(filteredArray: Array<any>, filterValue: any, brands: any[]): any {
		if(filterValue === '') return filteredArray;

		let filteredClients: any = [];
		filterValue = filterValue.trim().toLowerCase();

		brands.forEach((brand: any) => {
			let brandName = brand.name.trim().toLowerCase();
			if (brandName.includes(filterValue)) {
				filteredClients.push(brand);
			}
		});

		return filteredClients;
	}
}