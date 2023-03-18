import { MatTableDataSource } from '@angular/material/table';
import { GlobalConstants } from './../../shared/global-constants';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/services/bill.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ViewBillProductsComponent } from '../dialog/view-bill-products/view-bill-products.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.scss']
})
export class ViewBillComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email', 'contactNumber', 'paymentMethod', 'total', 'view']
  dataSource: any
  responseMessage: any;
  constructor(
    private billService: BillService,
    private formBuilder: FormBuilder,
    private ngxService: NgxUiLoaderService,
    private snackBarService: SnackbarService,
    private dialog: MatDialog,
    private router: Router) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

  tableData() {
    this.billService.getBills().subscribe((response: any) => {
      this.ngxService.stop();
      this.dataSource = new MatTableDataSource(response);
    }, ((error: any) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.message;
      } else {
        this.responseMessage = GlobalConstants.genericError
      }
      this.snackBarService.openSnackBar(this.responseMessage, GlobalConstants.error)
    }))
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleViewAction(value: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      data: value
    };
    dialogConfig.width = '100%';
    const dialogRef = this.dialog.open(ViewBillProductsComponent, dialogConfig);
    this.router.events.subscribe((response: any) => {
      dialogRef.close();
    })
  }

  downloadReportAction(value:any){
    this.ngxService.start();
    var data={
      name:value.name,
      email:value.email,
      uuid:value.uuid,
      contactNumber:value.contactNumber,
      productDetails:value.productDetails,
      paymentMethod:value.paymentMethod,
      totalAmount:value.total,
    }
    this.billService.getPDF(data).subscribe((response:any)=>{
      saveAs(response,value.uuid+'.pdf');
      this.ngxService.stop();
    })
  }

  handleDeleteAction(value:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data={
      message:`Delete ${value.name} bill`
    };
    const dialogRef=this.dialog.open(ConfirmationComponent,dialogConfig);
    const sub=dialogRef.componentInstance.onEmitStatusChange.subscribe((response:any)=>{
      this.ngxService.start();
      this.deleteProduct(value.id);
      dialogRef.close();
    })
  }

  deleteProduct(id:any){
    this.billService.deleteBill(id).subscribe((response:any)=>{
      this.ngxService.stop();
      this.tableData();
      this.responseMessage=response.message;
      this.snackBarService.openSnackBar(this.responseMessage,'success');
    },((error:any)=>{
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.message;
      } else {
        this.responseMessage = GlobalConstants.genericError
      }
      this.snackBarService.openSnackBar(this.responseMessage, GlobalConstants.error)
    }))
  }
}
