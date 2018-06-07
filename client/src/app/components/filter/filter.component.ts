import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { DataService } from '../../services/data.service';
import "@angular/material/prebuilt-themes/indigo-pink.css";
import { MatSnackBar } from '@angular/material';
import { process, State } from '@progress/kendo-data-query';
import {
	GridComponent,
	GridDataResult,
	DataStateChangeEvent
} from '@progress/kendo-angular-grid';

@Component({
	selector: 'filter',
	templateUrl: './filter.component.html',
	styleUrls: ['./filter.component.css']
})

export class FilterComponent {

	platforms: any[] = ["jrcigars", "cigars.com", "serious cigars", "Santaclaracigars.com"];
	selectedPlatform: string;

	codes: any;

	items: any = [];
	loading: boolean = true;
	gridData: any;
	distinctCategories: any;


	constructor(
		private accountService: AccountService,
		private dataService: DataService,
		private router: Router,
		public snackBar: MatSnackBar
	) { }

	selectionChange(e: any) {
		if (!e.value) return;
		this.loading = true;
		document.getElementById('loading').style.display = 'flex';
		this.dataService.getAllItemsByFilter(e.value).subscribe(res => {
			this.items = res;
			this.gridData = process(this.items, this.state);
			this.distinctCategories = this.distinct(this.items);
			this.loading = false;
			document.getElementById('loading').style.display = 'none';
		});
	}

	copyToClipboard() {
		this.dataStateChange();
		let codesArray: any = [];
		this.codes.data.map((item: any) => {
			codesArray.push(item.code);
		})
		codesArray = codesArray.join(' ');
		if (window['clipboardData'] && window['clipboardData'].setData) {
			return window['clipboardData'].setData("Text", codesArray);

		} else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
			var textarea = document.createElement("textarea");
			textarea.textContent = codesArray;
			textarea.style.position = "fixed";
			document.body.appendChild(textarea);
			textarea.select();
			try {
				this.snackBar.open('copied', '', {
					duration: 500,
					verticalPosition: 'top'
				});
				return document.execCommand("copy");
			} catch (ex) {
				console.warn("Copy to clipboard failed.", ex);
				return false;
			} finally {
				document.body.removeChild(textarea);
			}
		}
	}



	public state: State = {
		skip: 0,
		take: 20,

		filter: {
			logic: 'and',
			filters: [
				{ field: 'name', operator: 'contains', value: '' },
				{ field: 'code', operator: 'contains', value: '' },
			]
		}
	};
	


	distinct(data: any) {
		return data
			.map((x: any, index: any) => x.packaging_type)
			.filter((x: any, idx: any, xs: any) => xs.findIndex((y: any) => y.text === x.text) === idx);
	}

	dataStateChange(state?: DataStateChangeEvent): void {
		this.state = state || this.state;
		this.gridData = process(this.items, this.state);
		let obj: any = {};
		Object.assign(obj, this.state);
		obj.take = null;
		this.codes = process(this.items, obj);
	}
}