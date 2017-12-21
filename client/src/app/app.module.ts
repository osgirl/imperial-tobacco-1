import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AuthComponent } from './components/auth/auth.component';
import { MainComponent } from './components/main-chat/main-chat.component';
import { AuthGuard } from './guards/auth.guard';
import { UnauthGuard } from './guards/unauth.guard';
import { AccountService } from './services/account.service';
import { ValidateService } from './services/validate.service';
import { appRoutes } from './app.router';
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
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatIconModule} from '@angular/material/icon';
// import { MAT_DATE_LOCALE } from '@angular/material-moment-adapter';

import { SearchFilter } from './pipes/filter.pipe';


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
		MatNativeDateModule,
		MatPaginatorModule,
		MatIconModule
	],
	declarations: [
		AppComponent,
		AuthComponent,
		MainComponent,
		SearchFilter
	],
	providers: [
		AccountService,
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