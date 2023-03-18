import { GlobalConstants } from './../../../shared/global-constants';
import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  onAddCategory =new EventEmitter();
  onEditCategory =new EventEmitter();
  categoryForm:any=FormGroup;
  dialogAction:any='Add';
  action:any='Add';
  responseMessage:any;

  // categoryData={
  //   name:''
  // }
  constructor(
  @Inject(MAT_DIALOG_DATA) public dialogData:any,
  public formBuilder:FormBuilder,
  private categoryService:CategoryService,
  public dialogRef:MatDialogRef<CategoryComponent>,
  private snackBarService:SnackbarService) { }

  ngOnInit(): void {
    this.categoryForm=this.formBuilder.group({
      name:[null,[Validators.required]]
    });
    if(this.dialogData.action=="Edit"){
      this.dialogAction="Edit";
      this.action="Update";
      this.categoryForm.patchValue(this.dialogData.data)
    }
  }

  handleSubmit(){ 
    if(this.dialogAction=="Edit"){
      this.edit()
    }else{
      this.add()
    }
  }

  add(){
    var formData = this.categoryForm.value;
    console.log(formData)
    var data={
      name:formData.name,
    }
    console.log(data)
    this.categoryService.addData(data).subscribe((response:any)=>{
      this.dialogRef.close(response);
      console.log(response)
      this.onAddCategory.emit();
      this.responseMessage=response.message;
      this.snackBarService.openSnackBar(this.responseMessage,'success')
    },(error:any)=>{
      this.dialogRef.close();
      if(error.error?.message){
        this.responseMessage=error.message;
      }else{
        this.responseMessage=GlobalConstants.genericError
      }
      this.snackBarService.openSnackBar(this.responseMessage,GlobalConstants.error)
    })
  }

  edit(){
    var formData = this.categoryForm.value;
    var data={
      id:this.dialogData.data.id,
      name:formData.name,
    }
    this.categoryService.updateData(data).subscribe((response:any)=>{
      this.dialogRef.close(response);
      this.onEditCategory.emit();
      this.responseMessage=response.message;
      this.snackBarService.openSnackBar(this.responseMessage,'success')
    },(error:any)=>{
      this.dialogRef.close();
      if(error.error?.message){
        this.responseMessage=error.message;
      }else{
        this.responseMessage=GlobalConstants.genericError
      }
      this.snackBarService.openSnackBar(this.responseMessage,GlobalConstants.error)
    })
  }
}
