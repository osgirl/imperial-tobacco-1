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
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.css']
})
export class MainComponent{
	constructor(private accountService: AccountService,
		private router: Router,
		public snackBar: MatSnackBar) {}
	//variables for table view
	showTable: boolean = false;



	
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
		this.snackBar.open(msg, 'Okay', {
			duration: 3000,
			verticalPosition: 'top'
		});
	}

	submit(data: any) {

		let platform = data.platform;
		let month = data.month;
		let year = data.year;
		
		this.showTable = true;
	}
}