import { Routes } from '@angular/router';

import { AuthComponent } from './components/auth/auth.component';
import { AdminPickerComponent } from './components/picker/picker.component';
import { SKUPickerComponent } from './components/sku-picker/sku-picker.component';

import { BrandsTableComponent } from './components/brands-table/brands-table.component';
import { SKUListComponent } from './components/sku-list/sku-list.component';
import { FilterComponent } from './components/filter/filter.component';
import { FilterComponentNew } from './components/filter_new/filter.component';

import { AuthGuard } from './guards/auth.guard';
import { UnauthGuard } from './guards/unauth.guard';

export const appRoutes: Routes = [
	{ path: 'auth', component: AuthComponent, canActivate: [UnauthGuard] },

	{ path: 'admin', component: AdminPickerComponent, canActivate: [AuthGuard] },
	{ path: 'sku', component: SKUPickerComponent, canActivate: [AuthGuard] },
	{ path: 'item-picker', component: FilterComponent, canActivate: [AuthGuard] },
	{ path: 'item-picker_new', component: FilterComponentNew, canActivate: [AuthGuard] },

	{ path: 'brands', component: BrandsTableComponent, canActivate: [AuthGuard] },
	{ path: 'sku-list', component: SKUListComponent, canActivate: [AuthGuard] },

	// otherwise redirect to home
	{ path: '', redirectTo: '/admin', pathMatch: 'full'},
	{ path: '**', redirectTo: '/admin' },
];

