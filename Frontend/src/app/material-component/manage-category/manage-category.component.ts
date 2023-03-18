import { CategoryComponent } from './../dialog/category/category.component';
import { GlobalConstants } from './../../shared/global-constants';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.scss']
})
export class ManageCategoryComponent implements OnInit {
  displayColumns: string[] = ['name', 'edit']
  dataSource: any;
  responseMessage: any

  constructor(private categoryService: CategoryService,
    private ngxService: NgxUiLoaderService,
    private dialog: MatDialog,
    private snackBarService: SnackbarService,
    private router: Router) { 
      // ngxService.start();
    }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData()
  }

  tableData() {
    this.categoryService.getCategorys().subscribe((response: any) => {
      this.ngxService.stop();
      this.dataSource = new MatTableDataSource(response);
    }, (error) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackBarService.openSnackBar(this.responseMessage, GlobalConstants.error)
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleAddAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Add',
      // data:value
    }
    console.log(dialogConfig.data)
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(CategoryComponent, dialogConfig);

    this.router.events.subscribe(() => {
      dialogRef.close();
    })

    const sub=dialogRef.componentInstance.onAddCategory.subscribe((response:any)=>{
      this.tableData();
    })
  }

  handleEditAction(value: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data:value,
    }
    this.categoryService.category=dialogConfig.data.data
    console.log(dialogConfig.data);
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(CategoryComponent, dialogConfig)
    this.router.events.subscribe(() => {
      dialogRef.close();
    })
    const sub=dialogRef.componentInstance.onEditCategory.subscribe((response:any)=>{
      this.tableData()
    })
  }

  handleDeleteAction(value:any){

  }
}

