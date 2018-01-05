import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import {HttpRequest} from "@angular/common/http";
import {HttpClient} from '@angular/common/http';
import * as FileSaver from 'file-saver'; 

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

	getAllPlatforms() {
		return this.http.get('/getAllPlatforms', {}).toPromise().then(res => {
			return res.json()
		});
	}

	getBrandsByFilter(platform: string, month: number, year: number) {
		return this.http.get(`/getBrandsByFilter?platform=${platform}&month=${month}&year=${year}`, {}).toPromise().then(res => {
			return res.json()
		});
	}

	getNamesByFilter(platform: string, month: number, year: number) {
		return this.http.get(`/getNamesByFilter?platform=${platform}&month=${month}&year=${year}`, {}).toPromise().then(res => {
			return res.json()
		});
	}

	check() {
		return this.http.get('/test', {}).toPromise().then(res => {
			return res.json()
		});
	}

	getExcelFile(data: any) {
		let headers = new Headers({ 
			'Content-Type': 'application/json', 
			'Accept': 'application/xlsx'
		});
		
		let options = new RequestOptions({ headers: headers });
		options.responseType = ResponseContentType.Blob;
		
		this.http.post('/excel', {data: data}, options)
			.toPromise().then(res => {
				let fileBlob = res.blob();
				let blob = new Blob([fileBlob], { 
					type: 'application/xlsx'
				});

				let filename = 'data.xlsx';
				FileSaver.saveAs(blob, filename);
				
				document.getElementById('loading').style.display = 'none';
				return res;
			});
	}

	getPDFFile(data: any) {
		let headers = new Headers({ 
			'Content-Type': 'application/json', 
			'Accept': 'application/pdf'
		});
		
		let options = new RequestOptions({ headers: headers });
		options.responseType = ResponseContentType.Blob;
		
		this.http.post('/pdf', {data: data}, options)
			.toPromise().then(res => {
				let fileBlob = res.blob();
				let blob = new Blob([fileBlob], { 
					type: 'application/pdf'
				});

				let filename = 'data.pdf';
				FileSaver.saveAs(blob, filename);
				return res;
			});
	}
}