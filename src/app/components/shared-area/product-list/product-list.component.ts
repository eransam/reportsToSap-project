import { ProductsService } from 'src/app/services/products.service';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Unsubscribe } from 'redux';
import { ProductModel } from 'src/app/models/product.model';
import store from 'src/app/redux/store';
import { NotifyService } from 'src/app/services/notify.service';
import { RoleEnum } from 'src/app/models/role.enum';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/models/user.model';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  @ViewChild(SearchComponent) searchComponent: SearchComponent;

  user: UserModel;
  searchText: string;

  products: ProductModel[];
  unsubscribe: Unsubscribe;
  role: RoleEnum;
  @Output() clearSearchEmit = new EventEmitter<any>();

  constructor(
    private productsService: ProductsService,
    private notify: NotifyService,
    public router: Router
  ) {}

  async ngOnInit() {
    try {
      this.user = store.getState().authState.user;
      this.unsubscribe = store.subscribe(() => {
        this.products = store.getState().productsState.products;
        this.user = store.getState().authState.user;
        this.searchText = store.getState().productsState.searchText;
      });

      console.log('this.user: ', this.user);

      //Becauase it is a shared component
      this.role = store.getState().authState.user.role;

      this.products = await this.productsService.getAllProducts(); //Since we usually get all the products in login this will go to service and service will get products stright from redux's store
      console.log('this.products: ', this.products);

      this.unsubscribe = store.subscribe(() => {
        const selectedCategoryId =
          store.getState().categoriesState.selectedCategory;

        // Filter products by selected category
        if (selectedCategoryId != 'all') {
          this.products = store
            .getState()
            .productsState.products.filter(
              (p) => p.categoryId === selectedCategoryId
            );
        } else {
          this.products = store
            .getState()
            .productsState.products.filter((p) =>
              p.productname
                .toLowerCase()
                .includes(
                  store.getState().productsState.searchText.toLowerCase()
                )
            );
        }
      });
    } catch (err: any) {
      //   this.notify.error(err);
    }
  }

  clearSearch() {
    this.searchComponent.clearSearchField();
    this.clearSearchEmit.emit(); // Emit the clearSearch() function
  }

  ngOnDestroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  // ---------------------------------------------this is for admin only: ----------------------------------------------

  @Output()
  public editProductEmit = new EventEmitter<ProductModel>();

  public editProduct(product: ProductModel) {
    this.editProductEmit.emit(product);
  }

  // ---------------------------------------------this is for user only: ----------------------------------------------

  @Output()
  public addProductEmit = new EventEmitter<ProductModel>();

  @Output()
  public deleteProductEmit = new EventEmitter<ProductModel>();

  public addProduct(product: ProductModel) {
    this.addProductEmit.emit(product);
  }

  public deleteProduct(product: ProductModel) {
    console.log('deleteProduct in the list: ', product);

    this.deleteProductEmit.emit(product);
  }
}
