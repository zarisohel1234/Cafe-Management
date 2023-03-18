import { GlobalConstants } from './../shared/global-constants';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DashboardService } from './../services/dashboard.service';
import { Component, AfterViewInit } from '@angular/core';
import { SnackbarService } from '../services/snackbar.service';
import { MatDialogConfig,MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponent } from '../material-component/dialog/change-password/change-password.component';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {
	responseMessage:any
	data:any;
	ngAfterViewInit() { }

	constructor(private dashboardService:DashboardService,
		private ngxService:NgxUiLoaderService,
		private snackBarService:SnackbarService,
		private dialog:MatDialog,) {
			this.ngxService.start();
			this.dashboardData()
			// confirm('I am Khalid ')
	}

	dashboardData(){
		this.dashboardService.getDetails().subscribe((response: any)=>{
			this.ngxService.stop();
			console.log(response);
			this.data=response;
		},(error: any)=>{
			this.ngxService.stop();
			console.log(error)
			if(error.error?.message){
				this.responseMessage=error.error?.message
			}else{
				this.responseMessage=GlobalConstants.genericError;
			}
			this.snackBarService.openSnackBar(this.responseMessage,GlobalConstants.error)
		})
	}

	changePasswordAction(){
		const dialogConfig=new MatDialogConfig();
		dialogConfig.width="550px";
		this.dialog.open(ChangePasswordComponent,dialogConfig)
	  }
}
