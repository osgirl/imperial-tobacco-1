import { Component, ViewChild, OnInit, NgZone, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { Subscription } from 'rxjs';
import "@angular/material/prebuilt-themes/indigo-pink.css";
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition } from '@angular/material';
import { HttpEventType, HttpResponse } from "@angular/common/http";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import { Subject } from 'rxjs/Subject';

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
	months: object[] = [{viewValue: 'January', index: 1}, 
						{viewValue: 'February', index: 2}, 
						{viewValue: 'March', index: 3}, 
						{viewValue: 'April', index: 4}, 
						{viewValue: 'May', index: 5}, 
						{viewValue: 'June', index: 6}, 
						{viewValue: 'July', index: 7}, 
						{viewValue: 'August', index: 8}, 
						{viewValue: 'September', index: 9}, 
						{viewValue: 'October', index: 10}, 
						{viewValue: 'November', index: 11}, 
						{viewValue: 'December', index: 12}];
	selectedPlatform: string;
	selectedMonth: number;

	allBrands: any[];
	filteredBrands: any[] = [];

	tags: any[] = [];

	//variables for table view
	showTable: boolean = false;

	dataSource: MatTableDataSource<any>;
	displayedColumns = ['name'];
	@ViewChild(MatPaginator) paginator: MatPaginator;



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
		this.snackBar.open(msg, '', {
			duration: 3000,
			verticalPosition: 'top'
		});
	}

	rerenderTable(newData: any[]) {
		this.dataSource = new MatTableDataSource<any>(newData);
		this.dataSource.paginator = this.paginator;
	}


	submit() {
		this.showTable = true;

		this.accountService.getBrandsByFilter(this.selectedPlatform, this.selectedMonth).then(res => {
			this.allBrands = res;
			this.rerenderTable(res);
		});

		this.selectedPlatform = '';
		this.selectedMonth = 0;
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