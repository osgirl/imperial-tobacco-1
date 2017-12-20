import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import {HttpRequest} from "@angular/common/http";
import {HttpClient} from '@angular/common/http';

@Injectable()
export class AccountService {
	isLoggedIn: boolean;


	constructor(private http: Http, private httpClient: HttpClient) {
	}

	authenticateUser(user: any) {
		return this.http.post('/login', user, {}).toPromise().then(res => {
			return res.json()
		});
	}

	signUp(user: any) {
		return this.http.post('/signup', user, {}).toPromise().then(res => {
			return res.json()
		});
	}

	isAuth() {
		return this.http.get('/isAuth', {}).toPromise().then(res => {
			return res.json()
		});
	}

	loggedIn() {
		return this.isLoggedIn; // dev
	}

	logOut() {
		return this.http.post('/logout', {}).toPromise().then(res => {
			return res.json()
		});
	}

}