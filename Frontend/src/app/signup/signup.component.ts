import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm:any=FormGroup;
  responseMessage:any

  constructor(private formBuilder:FormBuilder,
    private router:Router,
    private userService:UserService,
    private snackBarService:SnackbarService,
    private dialogref:MatDialogRef<SignupComponent>,
    private ngxService:NgxUiLoaderService) { }

    handleSubmit(){
      this.ngxService.start();
      var formData=this.signupForm.value;
      var data={
        name:formData.name,
        email:formData.email,
        contactNumber:formData.contactNumber,
        password:formData.password,
      }
      this.userService.signup(data).subscribe((response:any)=>{
        this.ngxService.stop();
        this.dialogref.close();
        this.responseMessage=response.message;
        this.snackBarService.openSnackBar(this.responseMessage,'');
        this.router.navigate(['/']);
      }),(error:any)=>{
        this.ngxService.stop();
        if(error.error?.message){
          this.responseMessage=error.error?.message;
        }else{
          this.responseMessage=GlobalConstants.genericError;
        }
        this.snackBarService.openSnackBar(this.responseMessage,GlobalConstants.error)

      }
    }

  ngOnInit(): void {
    this.signupForm=this.formBuilder.group({
      name:[null,[Validators.required,Validators.pattern(GlobalConstants.nameRegex)]],
      email:[null,[Validators.required,Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber:[null,[Validators.required,Validators.pattern(GlobalConstants.contactNumberRegex)]],
      password:[null,[Validators.required]]  
    })
  }

}
