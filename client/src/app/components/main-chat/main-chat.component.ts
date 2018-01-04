import { Component, ViewChild, OnInit, NgZone, ChangeDetectionStrategy, HostListener } from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { Subscription } from 'rxjs';
import "@angular/material/prebuilt-themes/indigo-pink.css";
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition } from '@angular/material';
import { HttpEventType, HttpResponse } from "@angular/common/http";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import { Subject } from 'rxjs/Subject';
import {DatePickerComponent} from 'ng2-date-picker';

const html2pdf = require('html2pdf.js');
@Component({
	selector: 'app-main',
	templateUrl: './main-chat.component.html',
	styleUrls: ['./main-chat.component.css']
})
export class MainComponent implements OnInit{
	user: any = {
		username: 'admin'
	}
	platforms: any[];
	months: object = {'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6, 'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12};
	selectedPlatform: string;
	selectedMonth: string;

	allBrands: any[];
	allItems: any[];
	filteredBrands: any[] = [];

	checkedRows: any[] = [];

	tags: any[] = [];

	allSelected: boolean = false;
	//variables for table view
	showTable: boolean = false;

	dataSource: MatTableDataSource<any>;
	displayedColumns = ['check', 'name'];
	@ViewChild(MatPaginator) paginator: MatPaginator;

	platformControl = new FormControl('', [Validators.required]);
	monthControl = new FormControl('', [Validators.required]);



	constructor(private accountService: AccountService,
		private router: Router,
		public snackBar: MatSnackBar) {}

	ngOnInit() {
		this.accountService.getAllPlatforms().then(res => {
			this.platforms = res;
		});
	}

	ngAfterViewInit() {
	}
	
	home() {
		this.showTable = false;
		this.tags = [];
		this.allBrands = [];
		this.filteredBrands = [];
		this.checkedRows = [];
	}

	logOut() {
		this.accountService.logOut().then((res: any) => {
			if (res.success) {
				this.router.navigate(['/auth']);
			} else {
				this.openSnackBar(res.msg);
			}
		});
	}

	openSnackBar(msg: string) {
		this.snackBar.open(msg, 'Okay', {
			duration: 3000,
			verticalPosition: 'top'
		});
	}

	rerenderTable(newData: any[]) {
		this.dataSource = new MatTableDataSource<any>(newData);
		this.dataSource.paginator = this.paginator;
	}


	submit() {
		if(!(this.selectedPlatform && this.selectedMonth)) {
			this.openSnackBar("Please select all fields");
			return;
		}
		this.showTable = true;

		let month = this.months[this.selectedMonth.substring(0, 3)];
		let year = +this.selectedMonth.slice(-4);

		this.accountService.getBrandsByFilter(this.selectedPlatform, month, year).then(res => {
			this.allBrands = res;
			this.rerenderTable(res);
		});

		this.accountService.getNamesByFilter(this.selectedPlatform, month, year).then(res => {
			this.allItems = res;
			// this.rerenderTable(res);
		});

		this.selectedPlatform = '';
		this.selectedMonth = '';
	}


	addStatus(event: any) {
		if(!this.tags.length && this.checkedRows.length) this.checkedRows = [];
		//if we has already showed 'quantity' column, dont show it again
		// if(this.displayedColumns.indexOf('quantity') == -1) {
		// 	this.displayedColumns.push('quantity');			
		// }

		let newTag = event.option.value;

		//if such tag has already been added
		if(this.filteredBrands.find(x => x.name === newTag)) return;

		this.tags.push(newTag);

		let result = this.allItems.reduce(function(amount, current) {
			if(current.brand_name == newTag) return ++amount;
			else return amount;
		}, 0);

		let description = '';
		this.allBrands.forEach((brand) => {
			if(brand.name === newTag) {
				description = brand.description;
				return;
			}
		})


		this.filteredBrands.push({name: newTag, quantity: result, id: this.filteredBrands.length, description});
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

		if(!this.filteredBrands.length) {
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

		if(elem.selected) {
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
			if(item.brand_name == elem.name) elem.items.push(item);
		});

		this.checkedRows.push(elem);

		if(this.checkedRows.length === this.dataSource.filteredData.length) this.allSelected = true;
		
	}

	checkAll(value: boolean) {
		this.allSelected = value;
		this.checkedRows = [];
		
		if(value) {
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
		if(!this.checkedRows.length) return;

		this.accountService.getExcelFile(this.checkedRows);
	}

	getPDFFile() {
		if(!this.checkedRows.length) return;

		var element = document.getElementById('preview');
		html2pdf(element, {
			margin: 1,
			filename: 'data.pdf',
			jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
			html2canvas: { dpi: 192, letterRendering: true },
		});
	}
}