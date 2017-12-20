import { Routes } from '@angular/router';

import { MainComponent } from './components/main-chat/main-chat.component';
import { AuthComponent } from './components/auth/auth.component';

import { AuthGuard } from './guards/auth.guard';
import { UnauthGuard } from './guards/unauth.guard';

export const appRoutes: Routes = [
	{ path: '', component: MainComponent, canActivate: [AuthGuard] },
	{ path: 'auth', component: AuthComponent, canActivate: [UnauthGuard] },

	// otherwise redirect to home
	{ path: '**', redirectTo: '' },
];

