import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'filter'
})

export class SearchFilter implements PipeTransform {
	transform(filteredArray: Array<any>, filterValue: any, brands: any[], selectedType: number): any {
		if(filterValue === '') return filteredArray;

		let filteredClients: any = [];
		filterValue = filterValue.trim().toLowerCase();

		brands.forEach((brand: any) => {
			// console.log();
			if(!brand.name) return;

			let brandName = brand.name.trim().toLowerCase();
			if (brandName.includes(filterValue)) {
				if(selectedType){
					if(selectedType==1 && brand.items.some((item:any) => item.quantity == 5)){
						filteredClients.push(brand);
					} else if(selectedType==2 && brand.items.some((item:any) => item.quantity == 10)) {
						filteredClients.push(brand);
					}
				} else {
					filteredClients.push(brand);
				}
			}
		});

		return filteredClients;
	}
}