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
	filteredBrands: any[];

	statusSelected: any[] = [];

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

	submit() {
		this.showTable = true;

		this.accountService.getBrandsByFilter(this.selectedPlatform, this.selectedMonth).then(res => {
			this.filteredBrands = res;
			this.dataSource = new MatTableDataSource<any>(this.filteredBrands);
			this.dataSource.paginator = this.paginator;
		});

	}


	addStatus(event: any) {
		this.statusSelected.push(event.option.value);
		// this.displayedColumns.push('quantity');
	}

	removeStatus(value: string) {
		this.statusSelected.forEach((status, index) => {
			if(status === value) {
				this.statusSelected.splice(index, 1);
				return;
			}
		});
	}
}