import { Injectable } from '@angular/core';

@Injectable()
export class ValidateService {

	constructor() { }

	validateLogin(user: any) {
		if ((user.username == undefined || user.username == '') || (user.password == undefined || user.password == '')) {
			return false;
		} else {
			return true;
		}
	}

	validateUsername(username: any) {
		const re = /.*\S.*/;
		if (username.match(re)) {
			return true;
		} else {
			return false;
		}
	}


	validatePassword(password: any) {
		const re = /^(?=\S+$).{6,}$/;
		if (password.match(re)) {
			return true;
		} else {
			return false;
		}
	}


	validateRegister(user: any) {
		if (user.username == undefined || user.email == undefined || user.password == undefined) {
			return false;
		} else {
			return true;
		}
	}

	requireAllPasswordFields(oldPassword: string, newPassword: string) {
		if ((!oldPassword && newPassword) || (oldPassword && !newPassword)) {
			return false;
		} else {
			return true;
		}
	}

	validateEmail(email: any) {
		const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	}

}