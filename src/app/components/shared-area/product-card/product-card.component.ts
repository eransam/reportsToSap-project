import { ProductsService } from 'src/app/services/products.service';
import { RoleEnum } from './../../../models/role.enum';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductModel } from 'src/app/models/product.model';
import { environment } from 'src/environments/environment';
import { ViewChild } from '@angular/core';
@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent {
  @Input() FuncToDeleteSearchBar: () => void;

  @Input() clearSearchEmit: EventEmitter<any>;




  @Input()
  product: ProductModel;

  @Input()
  role: RoleEnum;

  userRole = RoleEnum.User;
  adminRole = RoleEnum.Admin;

  productsImageUrl = 'assets/images/products-img/images/';

  constructor(private productsService: ProductsService) {}

  // ---------------------------------------------this is for admin only: ----------------------------------------------
  @Output()
  public edit = new EventEmitter<ProductModel>();


  @Output()
  public runClearSearch = new EventEmitter<ProductModel>();


  public editProduct(product: ProductModel) {
    this.productsService.isAddAction.emit(false);
    this.edit.emit(product);
  }

  // ---------------------------------------------this is for user only: ----------------------------------------------

  @Output()
  public add = new EventEmitter<ProductModel>();

  @Output()
  public addToDelete = new EventEmitter<ProductModel>();

  public addProduct(product: ProductModel) {
    console.log("FuncToDeleteSearchBar: " ,this.FuncToDeleteSearchBar);
    this.runClearSearch.emit()
    // this.onButtonClick();
    // this.clearSearch();
    this.add.emit(product);
  }

  public deleteProduct(product: ProductModel) {
    console.log('deleteProduct: ', product);
    this.productsService.deleteProduct(product);
  }
}
