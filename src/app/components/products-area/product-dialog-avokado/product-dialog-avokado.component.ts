import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SearchComponent } from '../../shared-area/search/search.component';

@Component({
  selector: 'app-product-dialog-avokado',
  templateUrl: './product-dialog-avokado.component.html',
  styleUrls: ['./product-dialog-avokado.component.scss'],
})
export class ProductDialogComponentAvokado implements OnInit {
  selectedQuantity: number;

  quantity: number;
  constructor(private dialogRef: MatDialogRef<any>) {}

  selectQuantity(quantity: number) {
    this.selectedQuantity = quantity;
    this.dialogRef.close(this.selectedQuantity);
  }

  ngOnInit(): void {
    this.quantity = 1;
  }
}





