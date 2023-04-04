import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-product-dialog-numbers',
  templateUrl: './product-dialog-numbers.component.html',
  styleUrls: ['./product-dialog-numbers.component.scss'],
})
export class ProductDialogNumbersComponent implements OnInit {
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
