import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import 'rxjs/add/operator/map';
// import { Observable } from 'rxjs/Observable';
// import {HttpRequest} from "@angular/common/http";
import {HttpClient} from '@angular/common/http';
import * as FileSaver from 'file-saver'; 

@Injectable()
export class DataService {

	constructor(private http: Http, private httpClient: HttpClient) {
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
	
	getExcelFile(data: any, codes: any, platform: any, month: any, year: any) {
		let headers = new Headers({ 
			'Content-Type': 'application/json', 
			'Accept': 'application/xlsx'
		});
		
		let options = new RequestOptions({ headers: headers });
		options.responseType = ResponseContentType.Blob;
		
		this.http.post('/excel', {data: data, codes: codes, platform: platform, month: month, year: year}, options)
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