import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { appRoutes } from './app.router';

//components
import { AppComponent } from './app.component';
import { AuthComponent } from './components/auth/auth.component';
import { AdminPickerComponent } from './components/picker/picker.component';
import { SKUPickerComponent } from './components/sku-picker/sku-picker.component';
import { BrandsTableComponent } from './components/brands-table/brands-table.component';
import { SKUListComponent } from './components/sku-list/sku-list.component';
import { FilterComponent} from './components/filter/filter.component'

//guards
import { AuthGuard } from './guards/auth.guard';
import { UnauthGuard } from './guards/unauth.guard';

//services
import { AccountService } from './services/account.service';
import { DataService } from './services/data.service';
import { ValidateService } from './services/validate.service';

//pipes
import { SearchFilter } from './pipes/filter.pipe';
import { SKUFilter } from './pipes/sku_filter.pipe';
import { Unique } from './pipes/unique.pipe';

//angular material modules
import { AngularDraggableModule } from 'angular2-draggable';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog, MatDialogRef, MatNativeDateModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatIconModule} from '@angular/material/icon';
import {DpDatePickerModule} from 'ng2-date-picker';
// import { MAT_DATE_LOCALE } from '@angular/material-moment-adapter';

// Kendo Grid
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule, MultiSelectModule } from '@progress/kendo-angular-dropdowns';

import { DropDownListFilterComponent } from './components/filter/multicheck_filter.component'
import { MultiCheckFilterComponent } from './components/filter/multicheck-filter.component'

@NgModule({
	imports: [
		RouterModule.forRoot(appRoutes, { useHash: true }),
		BrowserModule,
		FormsModule,
		HttpModule,
		AngularDraggableModule,
		BrowserAnimationsModule,
		MatInputModule,
		MatButtonModule,
		MatMenuModule,
		MatTabsModule,
		MatExpansionModule,
		MatChipsModule,
		MatProgressBarModule,
		MatSnackBarModule,
		MatAutocompleteModule,
		MatTableModule,
		HttpClientModule,
		MatDialogModule,
		MatSelectModule,
		MatCheckboxModule,
		ReactiveFormsModule,
		MatListModule,
		MatCardModule,
		MatSlideToggleModule,
		MatDatepickerModule,
		MatProgressSpinnerModule,
		MatNativeDateModule,
		MatPaginatorModule,
		MatSortModule,
		MatIconModule,
		DpDatePickerModule,
		GridModule,
		DropDownsModule,
		MultiSelectModule
	],
	declarations: [
		AppComponent,
		AuthComponent,
		AdminPickerComponent,
		SKUPickerComponent,
		BrandsTableComponent,
		SKUListComponent,
		FilterComponent,
		SearchFilter,
		SKUFilter,
		Unique,
		DropDownListFilterComponent,
		MultiCheckFilterComponent
	],
	providers: [
		AccountService,
		DataService,
		ValidateService,
		AuthGuard,
		UnauthGuard,
		MatDialog
	],
	entryComponents: [],
	bootstrap: [AppComponent]
})
export class AppModule {
}