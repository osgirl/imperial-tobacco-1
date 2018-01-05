import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import "@angular/material/prebuilt-themes/indigo-pink.css";
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition } from '@angular/material';
import { HttpEventType, HttpResponse } from "@angular/common/http";
import { DatePickerComponent } from 'ng2-date-picker';

@Component({
	selector: 'picker',
	templateUrl: './picker.component.html',
	styleUrls: ['./picker.component.css']
})
export class PickerComponent implements OnInit{
	platforms: any[];
	months: object = {'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6, 'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12};
	selectedPlatform: string;
	selectedMonth: string;

	platformControl = new FormControl('', [Validators.required]);
	monthControl = new FormControl('', [Validators.required]);



	constructor(private accountService: AccountService, private router: Router, public snackBar: MatSnackBar) {}

	ngOnInit() {
		this.accountService.getAllPlatforms().then(res => {
			this.platforms = res;
		});
	}

	openSnackBar(msg: string) {
		this.snackBar.open(msg, 'Okay', {
			duration: 3000,
			verticalPosition: 'top'
		});
	}

	
	submit() {
		if(!(this.selectedPlatform && this.selectedMonth)) {
			this.openSnackBar("Please select all fields");
			return;
		}

		let month = this.months[this.selectedMonth.substring(0, 3)];
		let year = +this.selectedMonth.slice(-4);

		this.router.navigate(['/brands'], { queryParams: {platform: this.selectedPlatform, month, year} });
	}
}