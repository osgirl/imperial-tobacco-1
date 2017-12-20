import { Component, NgZone, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { Subscription } from 'rxjs';
import "@angular/material/prebuilt-themes/indigo-pink.css";
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition } from '@angular/material';
import { HttpEventType, HttpResponse } from "@angular/common/http";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Subject } from 'rxjs/Subject';

@Component({
	selector: 'app-main',
	templateUrl: './main-chat.component.html',
	styleUrls: ['./main-chat.component.css']
})
export class MainComponent {
	user: any = {
		username: 'admin'
	}
	

	constructor() {}
	

	onLogOut() {
		// this.accountService.logOut().then((res: any) => {
		// 	if (res.success) {
		// 		this.router.navigate(['/auth']);
		// 	} else {
		// 		this.openSnackBar(res.msg);
		// 	}
		// });
	}
}