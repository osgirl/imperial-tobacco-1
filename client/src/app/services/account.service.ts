import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
// import { Observable } from 'rxjs/Observable';
// import {HttpRequest} from "@angular/common/http";
import {HttpClient} from '@angular/common/http';

@Injectable()
export class AccountService {
	isLoggedIn: boolean;
	bSubject = new BehaviorSubject(false);


	constructor(private http: Http, private httpClient: HttpClient) {
	}

	authenticateUser(user: any) {
		return this.http.post('/login', user, {}).toPromise().then((res: any) => {
			if (JSON.parse(res._body).success) {
				this.bSubject.next(true)
			} else {
				this.bSubject.next(false)
			}
			return res.json()
		}, err => {
			this.bSubject.next(false)
		});
	}

	signUp(user: any) {
		return this.http.post('/signup', user, {}).toPromise().then(res => {
			return res.json()
		});
	}

	isAuth() {
		return this.http.get('/isAuth', {}).toPromise().then((res: any) => {
			if (JSON.parse(res._body).isAuth) {
				this.bSubject.next(true)
			} else {
				this.bSubject.next(false)
			}
			return res.json()
		}, err => {
			this.bSubject.next(false)
		});
	}

	loggedIn() {
		return this.isLoggedIn; // dev
	}

	logOut() {
		return this.http.post('/logout', {}).toPromise().then(res => {
			this.bSubject.next(false)
			return res.json()
		});
	}
}