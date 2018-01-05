import { Component, ViewChild, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Subscription } from 'rxjs';
import "@angular/material/prebuilt-themes/indigo-pink.css";
import { HttpEventType, HttpResponse } from "@angular/common/http";
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { Subject } from 'rxjs/Subject';

const html2pdf = require('html2pdf.js');
@Component({
	selector: 'brands-table',
	templateUrl: './brands-table.component.html',
	styleUrls: ['./brands-table.component.css']
})
export class BrandsTableComponent {
	@Input() platform: string;
	@Input() month: number;
	@Input() year: number;

	allBrands: any[];
	allItems: any[] = [];
	filteredBrands: any[] = [];

	checkedRows: any[] = [];

	tags: any[] = [];

	allSelected: boolean = false;
	//variables for table view
	showTable: boolean = false;

	dataSource: MatTableDataSource<any>;
	displayedColumns = ['check', 'name'];
	@ViewChild(MatPaginator) paginator: MatPaginator;


	constructor(private accountService: AccountService) { }

	ngOnInit() {
		this.accountService.getBrandsByFilter(this.platform, this.month, this.year).then(res => {
			this.allBrands = res;
			this.rerenderTable(res);
		});

		this.accountService.getNamesByFilter(this.platform, this.month, this.year).then(res => {
			res.forEach((item: any, index: number, self: any[]) => {				
				let a = this.allItems.find((x: any) => {
					return  item.name == x.name &&
							item.details.length == x.details.length &&
							item.details.ring == x.details.ring && 
							item.details.packaging_details.quantity == x.details.packaging_details.quantity &&
							item.prices.msrp == x.prices.msrp &&
							item.prices.jr_price == x.prices.jr_price
				});

				if(!a) this.allItems.push(item);


			});
		});
	}


	rerenderTable(newData: any[]) {
		this.dataSource = new MatTableDataSource<any>(newData);
		this.dataSource.paginator = this.paginator;
	}


	addStatus(event: any) {
		if (!this.tags.length && this.checkedRows.length) this.checkedRows = [];
		//if we has already showed 'quantity' column, dont show it again
		// if(this.displayedColumns.indexOf('quantity') == -1) {
		// 	this.displayedColumns.push('quantity');			
		// }

		let newTag = event.option.value;

		//if such tag has already been added
		if (this.filteredBrands.find(x => x.name === newTag)) return;

		this.tags.push(newTag);

		let result = this.allItems.reduce(function (amount, current) {
			if (current.brand_name == newTag) return ++amount;
			else return amount;
		}, 0);

		let description = '';
		this.allBrands.forEach((brand) => {
			if (brand.name === newTag) {
				description = brand.description;
				return;
			}
		})


		this.filteredBrands.push({ name: newTag, quantity: result, id: this.filteredBrands.length, description });
		this.rerenderTable(this.filteredBrands);
	}

	removeStatus(value: string) {
		//delete tag from tagList
		let index = this.tags.indexOf(value);
		this.tags.splice(index, 1);

		//delete brand from table
		let deletingBrand = this.filteredBrands.find(x => x.name === value);
		let deletingIndex = this.filteredBrands.indexOf(deletingBrand);
		this.filteredBrands.splice(deletingIndex, 1);

		if (!this.filteredBrands.length) {
			//if no tags left, hide 'quantity' column
			// let indexOfQuantityColumn = this.displayedColumns.indexOf('quantity');
			// this.displayedColumns.splice(indexOfQuantityColumn, 1);

			this.rerenderTable(this.allBrands);
		} else {
			this.rerenderTable(this.filteredBrands);
		}
	}


	onCheckboxChange(elem: any) {
		elem.selected = !elem.selected;

		if (elem.selected) {
			this.check(elem);
		} else {
			let uncheckedElem = this.checkedRows.find(x => x.id === elem.id)
			let uncheckedIndex = this.checkedRows.indexOf(uncheckedElem);
			this.checkedRows.splice(uncheckedIndex, 1);

			this.allSelected = false;
		}
	}

	check(elem: any) {
		elem.items = [];

		this.allItems.forEach((item) => {
			if (item.brand_name == elem.name) elem.items.push(item);
		});

		this.checkedRows.push(elem);

		if (this.checkedRows.length === this.dataSource.filteredData.length) this.allSelected = true;

	}

	checkAll(value: boolean) {
		this.allSelected = value;
		this.checkedRows = [];

		if (value) {
			this.dataSource.filteredData.forEach((element: any) => {
				this.check(element);

				element.selected = value;
			});

		} else {
			this.dataSource.filteredData.forEach((element: any) => {
				element.selected = value;
			});
		}
	}

	getExcelFile() {
		if (!this.checkedRows.length) return;

		this.accountService.getExcelFile(this.checkedRows);
	}

	getPDFFile() {
		if (!this.checkedRows.length) return;

		var element = document.getElementById('preview');
		html2pdf(element, {
			margin: 1,
			filename: 'data.pdf',
			jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
			html2canvas: { dpi: 192, letterRendering: true },
		});
	}
}