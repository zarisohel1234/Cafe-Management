import { GlobalConstants } from './../../../shared/global-constants';
import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { CategoryService } from 'src/app/services/category.service';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  onAddProduct =new EventEmitter();
  onEditProduct =new EventEmitter();
  productForm:any=FormGroup;
  dialogAction:any='Add';
  action:any='Add';
  responseMessage:any;
  categorys:any=[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData:any,
    public formBuilder:FormBuilder,
    private productyService:ProductService,
    private categoryService:CategoryService,
    public dialogRef:MatDialogRef<ProductComponent>,
    private snackBarService:SnackbarService) { }

  ngOnInit(): void {
    this.productForm=this.formBuilder.group({
      name:[null,[Validators.required,Validators.pattern(GlobalConstants.nameRegex)]],
      categoryId:[null,[Validators.required]],
      price:[null,[Validators.required]],
      description:[null,[Validators.required]],
    });
    if(this.dialogData.action=="Edit"){
      this.dialogAction="Edit";
      this.action="Update";
      this.productForm.patchValue(this.dialogData.data)
    }
    this.getCategorys();
  }

  handleSubmit(){ 
    if(this.dialogAction=="Edit"){
      this.edit()
    }else{
      this.add()
    }
  }

  getCategorys(){
    this.categoryService.getCategorys().subscribe((response:any)=>{
      this.categorys=response;
    },(error)=>{
      if(error.error?.message){
        this.responseMessage=error.message
      }else{
        this.responseMessage=GlobalConstants.genericError;
      }
      this.snackBarService.openSnackBar(this.responseMessage,GlobalConstants.error)
    })
  }

  edit(){
    var formData = this.productForm.value;
    var data={
      id:this.dialogData.data.id,
      name:formData.name,
      price:formData.price, 
      categoryId:formData.categoryId,
      description:formData.description
    }
    this.productyService.updateProduct(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onEditProduct.emit();
      this.responseMessage=response.message;
      this.snackBarService.openSnackBar(this.responseMessage,'success')
    },(error)=>{
      if(error.error?.message){
        this.responseMessage=error.message;
      }else{
        this.responseMessage=GlobalConstants.genericError
      }
      this.snackBarService.openSnackBar(this.responseMessage,GlobalConstants.error)
    })
  }

  add(){
    var formData = this.productForm.value;
    var data={
      name:formData.name,
      price:formData.price,
      categoryId:formData.categoryId,
      description:formData.description
    }
    this.productyService.addProduct(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.onAddProduct.emit();
      this.responseMessage=response.message;
      this.snackBarService.openSnackBar(this.responseMessage,'success')
    },(error)=>{
      if(error.error?.message){
        this.responseMessage=error.message;
      }else{
        this.responseMessage=GlobalConstants.genericError
      }
      this.snackBarService.openSnackBar(this.responseMessage,GlobalConstants.error)
    })
  }

}
