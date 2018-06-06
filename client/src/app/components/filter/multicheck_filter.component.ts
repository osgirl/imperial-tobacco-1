import { Component, Input } from '@angular/core';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { FilterService, BaseFilterCellComponent } from '@progress/kendo-angular-grid';

@Component({
	selector: 'my-dropdown-filter',
	template: `
    <kendo-dropdownlist
      [data]="data"
      (valueChange)="onChange($event)"
      [defaultItem]="defaultItem"
      [value]="selectedValue"
      [valuePrimitive]="true"
      [textField]="textField"
      [valueField]="valueField">
    </kendo-dropdownlist>
  `
})
export class DropDownListFilterComponent extends BaseFilterCellComponent {

	public get selectedValue(): any {
		const filter = this.filterByField(this.valueField);
		return filter ? filter.value : null;
	}

	@Input() public filter: CompositeFilterDescriptor;
	@Input() public data: any[];
	@Input() public textField: string;
	@Input() public valueField: string;

	public get defaultItem(): any {
		return {
			[this.textField]: 'Select item...',
			[this.valueField]: null
		};
	}

	constructor(filterService: FilterService) {
		super(filterService);
	}

	public onChange(value: any): void {

		let res;

		if (value === null) {
			res = this.removeFilter("packaging_type.value")
		} else {
			res = this.updateFilter({ // add a filter for the field with the value
				field: "packaging_type.value",
				operator: 'eq',
				value: value
			})
		}
		this.applyFilter(res); // update the root filter
	}
}