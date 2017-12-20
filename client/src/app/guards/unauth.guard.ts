import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {AccountService} from '../services/account.service';

@Injectable()
export class UnauthGuard implements CanActivate {
	constructor(private accountService: AccountService, private router: Router) {
	}

	async canActivate() {
		let body = await this.accountService.isAuth();

		if (!body.isAuth) {
			return true;
		} else {
			this.router.navigate(['/auth']);
			return false;
		}
	}
}