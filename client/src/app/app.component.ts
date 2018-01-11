import { Component } from '@angular/core';
import '../assets/css/styles.css';

import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition } from '@angular/material';
import { AccountService } from './services/account.service'

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	isAuth$: any;

	constructor(private accountService: AccountService, private router: Router, public snackBar: MatSnackBar) {
		this.isAuth$ = accountService.bSubject;
	}

	home() {
		this.router.navigate(['/']);
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
}
