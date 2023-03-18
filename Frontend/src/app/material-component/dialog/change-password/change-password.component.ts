import { GlobalConstants } from './../../../shared/global-constants';
import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from 'src/app/services/snackbar.service';


@Component({
  selector: 'app-change-password',
  templateUrl:'./change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm:any=FormGroup;
  responseMessage:any;

  constructor(private formBuilder:FormBuilder,
    private router:Router,
    private userService:UserService,
    private snackBarService:SnackbarService,
    private dialogref:MatDialogRef<ChangePasswordComponent>,
    private ngxService:NgxUiLoaderService) { }

    handleChangePasswordSubmit(){
      this.ngxService.start();
      var formData=this.changePasswordForm.value;
      var data={
        oldPassword:formData.oldPassword,
        newPassword:formData.newPassword,
        confirmPassword:formData.confirmPassword
      }
      this.userService.changePassword(data).subscribe((response:any)=>{
        this.ngxService.stop();
        this.responseMessage=response?.message;
        this.dialogref.close();
        this.snackBarService.openSnackBar(this.responseMessage,'Success')
      },(error)=>{
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

    validateSubmit(){
      if(this.changePasswordForm.controls['newPassword'].value != this.changePasswordForm.controls['confirmPassword'].value){
        return true;
      }else{
        return false;
      }
    }

  ngOnInit(): void {
    this.changePasswordForm=this.formBuilder.group({
      oldPassword:[null,[Validators.required]],
      newPassword:[null,[Validators.required]],
      confirmPassword:[null,[Validators.required]],
    })
  }

}
