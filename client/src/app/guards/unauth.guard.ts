import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AccountService} from '../services/account.service';

@Injectable()
export class UnauthGuard implements CanActivate {
	constructor(private accountService: AccountService, private router: Router) {
	}

	async canActivate() {
		let body = await this.accountService.isAuth();

		return !body.isAuth;
	}
}