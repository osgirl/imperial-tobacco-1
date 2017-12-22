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
	filteredBrands: any[] = [];

	tags: any[] = [];

	//variables for table view
	showTable: boolean = false;

	dataSource: MatTableDataSource<any>;
	displayedColumns = ['name'];
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

		this.selectedPlatform = '';
		this.selectedMonth = '';
	}


	addStatus(event: any) {
		//if we has already showed 'quantity' column, dont show it again
		if(this.displayedColumns.indexOf('quantity') == -1) {
			this.displayedColumns.push('quantity');			
		}

		let newTag = event.option.value;

		//if such tag has already been added
		if(this.filteredBrands.find(x => x.name === newTag)) return;

		this.tags.push(newTag);

		let result = this.allBrands.reduce(function(amount, current) {
			if(current.name == newTag) return ++amount;
			else return amount;
		}, 0);


		this.filteredBrands.push({name: newTag, quantity: result});
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
			let indexOfQuantityColumn = this.displayedColumns.indexOf('quantity');
			this.displayedColumns.splice(indexOfQuantityColumn, 1);

			this.rerenderTable(this.allBrands);
		} else {
			this.rerenderTable(this.filteredBrands);
		}
	}
}