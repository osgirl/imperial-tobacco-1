import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'sku_filter'
})

export class SKUFilter implements PipeTransform {
	transform(filteredArray: Array<any>, filterValue: any, brands: any[]): any {
		if(filterValue === '') return filteredArray;

		
		let filteredBrands = brands.filter((item) => item.code.toLowerCase().includes(filterValue.toLowerCase()));
		
		return filteredBrands.slice(0, 1000);
	}
}