import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { CompositeFilterDescriptor, distinct, filterBy, FilterDescriptor } from '@progress/kendo-data-query';
import { FilterService, BaseFilterCellComponent } from '@progress/kendo-angular-grid';

@Component({
  selector: 'multicheck-filter',
  template: `
    <ul>
      <input class="k-textbox" (input)="onInput($event)" />

      <li
        (click)="onSelectAll()"
        [ngClass]="{'k-state-selected': selectAll}">
        <input
          type="checkbox"
          id="chk-all"
          class="k-checkbox"
          [checked]="selectAll" />
        <label
          class="k-multiselect-checkbox k-checkbox-label"
          for="chk-all">
          Select All
        </label>
      </li>

      <li
        *ngFor="let item of currentData; let i = index;"
        (click)="onSelectionChange(valueAccessor(item))"
        [ngClass]="{'k-state-selected': isItemSelected(item)}">
        <input
          type="checkbox"
          id="chk-{{valueAccessor(item)}}"
          class="k-checkbox"
          [checked]="isItemSelected(item)" />
        <label
          class="k-multiselect-checkbox k-checkbox-label"
          for="chk-{{valueAccessor(item)}}">
            {{ textAccessor(item) }}
        </label>
      </li>
    </ul>
  `,
  styles: [`
    ul {
      list-style-type: none;
      height: 200px;
      overflow-y: scroll;
      padding-left: 0;
      padding-right: 12px;
    }

    ul>li {
      padding: 8px 12px;
      border: 1px solid rgba(0,0,0,.08);
      border-bottom: none;
    }

    ul>li:last-of-type {
      border-bottom: 1px solid rgba(0,0,0,.08);
    }

    .k-multiselect-checkbox {
      pointer-events: none;
    }
  `]
})
export class MultiCheckFilterComponent extends BaseFilterCellComponent implements AfterViewInit {
  @Input() public isPrimitive: boolean;
  @Input() public filter: CompositeFilterDescriptor;
  @Input() public data: any;
  @Input() public textField: any;
  @Input() public valueField: any;
  @Input() public filterService: FilterService;
  @Input() public filterField: string;
  @Output() public valueChange = new EventEmitter<number[]>();

  constructor(filterService: FilterService) {
    super(filterService);
  }

  public currentData: any = [];
  public showFilter = true;
  private value: any[] = [];
  public selectAll = true;

  protected textAccessor = (dataItem: any) => this.isPrimitive ? dataItem : dataItem[this.textField];
  protected valueAccessor = (dataItem: any) => this.isPrimitive ? dataItem : dataItem[this.valueField];

  public ngAfterViewInit() {
    setTimeout(() => {
        this.currentData = this.data;
    
        this.showFilter = typeof this.textAccessor(this.currentData[0]) === 'string';  
    })
  }

  public onSelectAll() {
    if (!this.selectAll) {
      this.selectAll = true
      this.value = [];
      this.applyCurrentFilters();
    }
  }

  public isItemSelected(item: any) {
    return this.value.some(x => x === this.valueAccessor(item));
  }

  public onSelectionChange(value: any): void {
    if (this.value.some(x => x === value)) {
      this.value = this.value.filter(x => x !== value);
    } else {
      this.value.push(value);
    }

    if (!this.value.length) {
      this.selectAll = true;
    } else {
      this.selectAll = false;
    }

    this.applyCurrentFilters();
  }

  private applyCurrentFilters() {
    this.applyFilter({
      filters: this.value.map((value) => ({
        field: this.filterField,
        operator: 'eq',
        value
      })),
      logic: 'or'
    })
  }

  public onInput(e: any) {
    this.currentData = distinct([
      ...this.currentData.filter((dataItem: any) => this.value.some(val => val === this.valueAccessor(dataItem))),
      ...filterBy(this.data, {
        operator: 'contains',
        field: this.textField,
        value: e.target.value
      })],
        this.textField
      );
  }
}
