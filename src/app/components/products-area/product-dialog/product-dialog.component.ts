import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { SearchComponent } from '../../shared-area/search/search.component';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.scss'],
})
export class ProductDialogComponent implements OnInit {
  quantity: number;
  selectedQuantity: number = 1;
  selectQuantity(quantity: number) {
    this.selectedQuantity = quantity;
  }

  ngOnInit(): void {
    this.quantity = 1;
  }
}
