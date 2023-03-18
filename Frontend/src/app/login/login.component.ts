import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
loginForm:any = FormGroup;
  responseMessage: any;

constructor(private formBuilder:FormBuilder,
  private router:Router,
  private userService:UserService,
  private snackBarService:SnackbarService,
  private dialogref:MatDialogRef<LoginComponent>,
  private ngxService:NgxUiLoaderService) { }

  ngOnInit(): void {
    this.loginForm=this.formBuilder.group({
      email:[null,[Validators.required,Validators.pattern(GlobalConstants.emailRegex)]],
      password:[null,[Validators.required]]
    })
  }

  handleSubmit(){
    this.ngxService.start();
    var formData=this.loginForm.value;
    var data={
      email:formData.email,
      password:formData.password
    }
    this.userService.login(data).subscribe((response:any)=>{
        this.ngxService.stop();
        this.dialogref.close();
        localStorage.setItem('token',response.token)
        this.snackBarService.openSnackBar(this.responseMessage,'');
        this.router.navigate(['/cafe/dashboard']);
    },(error:any)=>{
      this.ngxService.stop();
      if(error.error?.message){
        this.responseMessage=error.error?.message;
      }else{
        this.responseMessage=GlobalConstants.genericError;
      }
      this.snackBarService.openSnackBar(this.responseMessage,GlobalConstants.error)
    })
  }

  handle(){
    const data={}
    this.userService.login(data).subscribe((resp:any)=>{

    },(err:any)=>{

    })
  }

}
// Test Case Preparation, 
// Web App Testing, 
// Mobile App Testing, 
// API Testing, 
// UI Testing, 
// Functional Testing, 
// Cross Browser Testing, 
// Security Testing