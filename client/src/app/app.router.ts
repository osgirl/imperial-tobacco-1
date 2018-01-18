import { Routes } from '@angular/router';

import { AuthComponent } from './components/auth/auth.component';
import { PickerComponent } from './components/picker/picker.component';
import { BrandsTableComponent } from './components/brands-table/brands-table.component';

import { AuthGuard } from './guards/auth.guard';
import { UnauthGuard } from './guards/unauth.guard';

export const appRoutes: Routes = [
	{ path: '', component: PickerComponent, canActivate: [AuthGuard] },
	{ path: 'auth', component: AuthComponent, canActivate: [UnauthGuard] },
	{ path: 'brands', component: BrandsTableComponent, canActivate: [AuthGuard] },

	// otherwise redirect to home
	{ path: '**', redirectTo: '' },
];

