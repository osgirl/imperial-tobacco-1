import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AccountService } from '../../services/account.service';
import { ValidateService } from '../../services/validate.service';

import {MatSnackBar} from '@angular/material';

import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-auth',
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.css']
})
export class AuthComponent {

	@Input() formControl: FormControl;
	myForm: FormGroup = new FormGroup({
		"username": new FormControl('', [
			Validators.required,
			Validators.pattern(/.*\S.*/)
		]),
		"password": new FormControl('', [
			Validators.required,
			Validators.pattern(/.*\S.*/)
		]),
	});

	constructor(private accountService: AccountService,
		private validateService: ValidateService,
		private router: Router,
		public snackBar: MatSnackBar) {
	}

	openSnackBar(msg: string) {
		this.snackBar.open(msg, '', {
			duration: 3000,
			verticalPosition: 'top'
		});
	}


	login() {
		let data = this.myForm.value;
		const user = { username: data.username.trim(), password: data.password };
		if (!this.validateService.validateLogin(user)) {
			this.openSnackBar('Please use a validate data');
			return false;
		}
		this.accountService.authenticateUser(user).then(data => {
			if (data.success) {
				this.accountService.isLoggedIn = true;
				this.router.navigate(['']);
			} else {
				this.openSnackBar(data.message);
			}
		});
	}
}