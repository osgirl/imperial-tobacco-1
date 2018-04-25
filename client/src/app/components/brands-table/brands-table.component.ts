import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { DataService } from '../../services/data.service';

import "@angular/material/prebuilt-themes/indigo-pink.css";
import { MatPaginator, MatTableDataSource } from '@angular/material';

const html2pdf = require('html2pdf.js');
@Component({
	selector: 'brands-table',
	templateUrl: './brands-table.component.html',
	styleUrls: ['./brands-table.component.css']
})
export class BrandsTableComponent {
	private platform: string;
	private month: number;
	private year: number;

	allBrands: any[] = [];
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


	constructor(private accountService: AccountService, private dataService: DataService, private route: ActivatedRoute) {
		this.route.queryParams.subscribe(params => {
			this.platform = params.platform;
			this.month = params.month;
			this.year = params.year;
		});
	}

	ngOnInit() {
		document.getElementById('loading').style.display = 'flex';

		this.dataService.getBrandsByFilter(this.platform, this.month, this.year).then(res => {
			this.allBrands = res;
			this.rerenderTable(res);
			document.getElementById('loading').style.display = 'none';
			// this.allBrands.forEach((brand) => this.check(brand));

		});

		// this.dataService.getNamesByFilter(this.platform, this.month, this.year).then(res => {
		// 	this.allItems = res;
		// });
	}

	rerenderTable(newData: any[]) {
		this.dataSource = new MatTableDataSource<any>(newData);
		this.dataSource.paginator = this.paginator;
	}


	addStatus(newTag: any) {

		//if such tag has already been added
		if (this.tags.find(x => x.name === newTag)) return;


		if (!this.tags.length && this.checkedRows.length) this.checkedRows = [];

		let tagId = this.tags.length;
		this.tags.push({ name: newTag, id: tagId });

		this.allBrands.forEach((brand) => {
			let isBrandMatchesNewTag = brand.name.toLowerCase().includes(newTag.toLowerCase());
			let isBrandAlreadyAdded = !(this.filteredBrands.find(x => x.name === brand.name))
			
			if (isBrandMatchesNewTag && isBrandAlreadyAdded) {

				let name = brand.name;
				let id = this.filteredBrands.length;
				let description = brand.description;
				let selected = brand.selected;
				let items = brand.items;
		
				this.filteredBrands.push({ name, id, tagId, description, selected, items });

				if(selected) this.check(this.filteredBrands[this.filteredBrands.length - 1]);
			}
		})

		this.rerenderTable(this.filteredBrands);
		if (this.checkedRows.length === this.dataSource.filteredData.length) this.allSelected = true;
	}

	removeStatus(tagId: number) {
		//delete tag from tagList
		let deletingTag = this.tags.find(x => x.id === tagId);
		let deletingIndex = this.tags.indexOf(deletingTag);
		this.tags.splice(deletingIndex, 1);

		//delete brands from table
		this.filteredBrands = this.filteredBrands.filter((brand) => {
			if(brand.tagId === tagId) this.onCheckboxChange(brand);
			return brand.tagId !== tagId;
		});

		
		if (!this.tags.length) {
			this.rerenderTable(this.allBrands); //no more tags - bring all brands back
			this.allBrands.forEach((brand) => brand.selected && this.check(brand)); 
		} else {
			this.rerenderTable(this.filteredBrands);
			if (this.checkedRows.length === this.dataSource.filteredData.length) this.allSelected = true;
		}
	}

	onCheckboxChange(elem: any) {
		elem.selected = !elem.selected;

		if (elem.selected) {
			this.check(elem);
		} else {
			let uncheckedElem = this.checkedRows.find(x => x.name === elem.name)
			let uncheckedIndex = this.checkedRows.indexOf(uncheckedElem);
			this.checkedRows.splice(uncheckedIndex, 1);

			this.allSelected = false;
		}
	}

	check(elem: any) {
		this.checkedRows.push(elem);
		this.checkedRows.sort((a, b) => {
			if(a.name > b.name) return 1;
			else return -1;
		});


		if (this.checkedRows.length === this.dataSource.filteredData.length) this.allSelected = true;

	}

	checkAll(value: boolean) {
		this.allSelected = value;
		this.checkedRows = [];

		this.dataSource.filteredData.forEach((element: any) => {
			if (value) this.check(element);

			element.selected = value;
		});
	}

	getExcelFile() {
		if (!this.checkedRows.length) return;
		document.getElementById('loading').style.display = 'flex';

		let codes: any[] = [];
		let data = this.checkedRows.map((row) => {
			row.items.forEach((item: any) => {
				if(item.selected) codes.push(item.code);
			})

			return row.name
		});

		this.dataService.getExcelFile(data, codes, this.platform, this.month, this.year);
	}

	getPDFFile() {
		if (!this.checkedRows.length) return;

		let rows = document.querySelectorAll('.preview-item');
		for(let i = 0; i < rows.length; i++) {
			let td = rows[i].children.item(0);
			let checkbox = td.children.item(0);
			let checked = checkbox.classList.contains('mat-checkbox-checked');

			if(!checked) rows[i].classList.add('hidden');
			else checkbox.classList.add('hidden');
		}

		var element = document.getElementById('preview');
		html2pdf(element, {
			margin: 1,
			filename: 'data.pdf',
			jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
			html2canvas: { dpi: 192, letterRendering: true },
		});


		let hiddenElements = document.querySelectorAll('.hidden');
		for(let i = 0; i < hiddenElements.length; i++) {
			hiddenElements[i].classList.remove('hidden');
		}
	}
}