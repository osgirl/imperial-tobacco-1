import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { DataService } from '../../services/data.service';
import "@angular/material/prebuilt-themes/indigo-pink.css";
import { MatSnackBar } from '@angular/material';

@Component({
	selector: 'picker',
	templateUrl: './picker.component.html',
	styleUrls: ['./picker.component.css']
})
export class AdminPickerComponent implements OnInit{
	platforms: any[] = ["jrcigars", "cigars.com", "serious cigars", "Santaclaracigars.com"];
	// months: object = {'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6, 'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12};
	
	selectedPlatform: string;
	// selectedMonth: string;

	platformControl = new FormControl('', [Validators.required]);
	// monthControl = new FormControl('', [Validators.required]);



	constructor(private accountService: AccountService, private dataService: DataService, private router: Router, public snackBar: MatSnackBar) {}

	ngOnInit() { }

	openSnackBar(msg: string) {
		this.snackBar.open(msg, 'Okay', {
			duration: 3000,
			verticalPosition: 'top'
		});
	}

	
	submit() {
		if(!(this.selectedPlatform)) {
			this.openSnackBar("Please select all fields");
			return;
		}

		this.router.navigate(['/brands'], { queryParams: { platform: this.selectedPlatform } });
	}
}