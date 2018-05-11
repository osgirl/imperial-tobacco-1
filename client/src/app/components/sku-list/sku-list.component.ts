import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { DataService } from '../../services/data.service';

import "@angular/material/prebuilt-themes/indigo-pink.css";
import { MatPaginator, MatTableDataSource, MatAutocompleteTrigger } from '@angular/material';

const html2pdf = require('html2pdf.js');
@Component({
	selector: 'sku-list',
	templateUrl: './sku-list.component.html',
	styleUrls: ['./sku-list.component.css']
})
export class SKUListComponent {
	private loading: boolean;
	private showTable: boolean = true;
	private platform: string;

	allBrands: any[] = [];
	filteredBrands: any[] = [];
	tags: any[] = [];

	dataSource: MatTableDataSource<any>;
	displayedColumns = [ 'code', 'frontmark', 'quantity', "msrp", "price", "five_pack_price" ];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatAutocompleteTrigger) brandAutocomplete: MatAutocompleteTrigger;

	constructor(private accountService: AccountService, private dataService: DataService, private route: ActivatedRoute) {
		this.route.queryParams.subscribe(params => {
			this.platform = params.platform;
		});
	}

	ngOnInit() {
		this.loading = true;

		this.dataService.getSKUList(this.platform).then(res => {
			this.allBrands = res;
			// this.filteredBrands = res;
			this.rerenderTable(res);

			this.showTable = Boolean(res.length);

			this.loading = false;
		});
	}

	rerenderTable(newData: any[]) {
		this.dataSource = new MatTableDataSource<any>(newData);
		this.dataSource.paginator = this.paginator;
	}

	addStatus(newTag: any) {
		//if such tag has already been added
		if (this.tags.find(x => x.name === newTag)) return;

		let tagId = this.tags.length;
		this.tags.push({ name: newTag, id: tagId });

		let item = this.allBrands.find(x => x.code.toLowerCase().includes(newTag.toLowerCase()));

		if(item) {
			this.filteredBrands.push({ ...item, tagId });
		}

		this.rerenderTable(this.filteredBrands);
		this.brandAutocomplete.closePanel();
	}

	removeStatus(tagId: number) {
		//delete tag from tagList
		let deletingTag = this.tags.find(x => x.id === tagId);
		let deletingIndex = this.tags.indexOf(deletingTag);
		this.tags.splice(deletingIndex, 1);

		//delete brands from table
		this.filteredBrands = this.filteredBrands.filter((brand) => {
			return brand.tagId !== tagId;
		});

		
		if (!this.tags.length) {
			this.rerenderTable(this.allBrands); //no more tags - bring all brands back
		} else {
			this.rerenderTable(this.filteredBrands);
		}
	}
}