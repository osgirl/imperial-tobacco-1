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

	listItems: any = ['Other'];

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


	distinct(data:any) {
		return data
			.map((x:any, index: any) => x.packaging_type)
			.filter((x:any, idx:any, xs:any) => xs.findIndex((y:any) => y.text === x.text) === idx);
	}

	dataStateChange(state: DataStateChangeEvent): void {
		this.state = state;
		this.gridData = process(this.items, this.state);
	}
}