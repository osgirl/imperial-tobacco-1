import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { DataService } from '../../services/data.service';
import "@angular/material/prebuilt-themes/indigo-pink.css";
import { MatSnackBar } from '@angular/material';
import { process, State, distinct } from '@progress/kendo-data-query';
import { DataStateChangeEvent } from '@progress/kendo-angular-grid';

@Component({
	selector: 'filter',
	templateUrl: './filter.component.html',
	encapsulation: ViewEncapsulation.None,
	styleUrls: ['./filter.component.css']
})

export class FilterComponentNew {
	codes: any;

	items: any = [];
	loading: boolean = true;
	gridData: any;
	distinctCategories: any = {
		"category_name": [],
		"packaging_type": {
			distField: "text"
		},
		"quantity": []
	}
	
	headerStyle = {'background-color': '#456a76','color': '#fff'};

	constructor(
		private accountService: AccountService,
		private dataService: DataService,
		private router: Router,
		public snackBar: MatSnackBar
	) { }

	ngOnInit(){
		this.loading = true;
		document.getElementById('loading').style.display = 'flex';
		this.dataService.getAllItemsByFilter('jrcigars', 'jrcigars').subscribe(res => {
			this.items = res;
			this.gridData = process(this.items, this.state);
			this.setDistinct();
			this.loading = false;
			document.getElementById('loading').style.display = 'none';
		});
	}

	setDistinct() {
		for (let cat in this.distinctCategories) {
			if (Array.isArray(this.distinctCategories[cat])) {
				this.distinctCategories[cat] = this.distinctPrimitive(this.items, cat)
			} else {
				this.distinctCategories[cat] = this.distinct(this.items, cat, "text")
			}
		}
	}

	copyToClipboard() {
		this.dataStateChange();
		let codesArray: any = [];
		this.codes.data.map((item: any) => {
			codesArray.push(item.code);
		})
		codesArray = codesArray.join(', ');
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
			filters: []
		}
	};
	


	distinct(data: any, cat: string, distField: string) {
		return data
			.map((x: any) => x[cat])
			.filter((x: any, idx: any, xs: any) => xs.findIndex((y: any) => y[distField] === x[distField]) === idx);
	}

	distinctPrimitive(data: any, cat: string): any {
		return data
			.map((x: any) => x[cat])
			.filter((x: any, idx: any, xs: any) => xs.findIndex((y: any) => x === y) === idx);
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