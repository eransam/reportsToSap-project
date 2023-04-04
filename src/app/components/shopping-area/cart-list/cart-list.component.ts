import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Unsubscribe } from 'redux';
import { CartItemModel } from 'src/app/models/cart-item.model';
import { CartModel } from 'src/app/models/cart.model';
import { ProductModel } from 'src/app/models/product.model';
import { getActiveCartAction } from 'src/app/redux/carts-state';
import store from 'src/app/redux/store';
import { CartsService } from 'src/app/services/carts.service';
import { NotifyService } from 'src/app/services/notify.service';
import { ProductDialogComponent } from '../../products-area/product-dialog/product-dialog.component';
import { ProductDialogComponentAvokado } from '../../products-area/product-dialog-avokado/product-dialog-avokado.component';

import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';
import { ProductDialogNumbersComponent } from '../../product-dialog-numbers/product-dialog-numbers.component';
import { ViewChild } from '@angular/core';
import { SearchComponent } from '../../shared-area/search/search.component';
@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.scss'],
})
export class CartListComponent implements OnInit, OnDestroy {
  @ViewChild(SearchComponent) searchComponent: SearchComponent;

  opened = true;
  isShoppingPage = true;
  allItemsByCart: any[];
  cartByUser: CartModel;
  totalAmount: number;
  unsubscribe: Unsubscribe;
  showSuccessMessage: boolean = false;

  constructor(
    private notify: NotifyService,
    private cartsService: CartsService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  async ngOnInit() {
    try {
      const cart = await this.cartsService.getCartByUser(
        store.getState().authState.user.userId
      );
      this.allItemsByCart = await this.cartsService.getAllItemsByCart(
        cart?.cartId
      );

      this.totalAmount = this.cartsService.getTotalCartAmount();

      if (store.getState().cartsState.cartItems.length === 0) {
        this.opened = true;
      }
      if (cart?.isClosed) {
        this.totalAmount = this.cartsService.getTotalCartAmount();
      }
      console.log('allItemsByCart: ', this.allItemsByCart);

      this.unsubscribe = store.subscribe(() => {
        this.allItemsByCart = store.getState().cartsState.cartItems;

        this.totalAmount = this.cartsService.getTotalCartAmount();
      });
    } catch (err: any) {
      //   this.notify.error(err);
    }
  }

  amount: '23';
  cartId: 1;
  cartId1: 1;
  date: null;
  imageName: 'de4eTraTo4.jpg';
  isClosed: false;
  itemsId: 55;
  note: '23';
  price: 43;
  productId: 43;
  productId1: 43;
  productname: 'test';
  quantity: '1';
  status: true;
  total: '43';
  userId: 555;

  async sendOrderDetails(totalAmount: any) {
    try {
      console.log('totalAmount1: ', totalAmount);

      let currentDate = new Date();
      let year = currentDate.getFullYear();
      let month = currentDate.getMonth() + 1;
      let day = currentDate.getDate();

      let newDate = new Date(year, month - 1, day); // month is zero-based, so subtract 1
      const theTotalAmount = totalAmount;
      const newArray = this.allItemsByCart.map((obj) => {
        delete obj.cartId; // remove the age property from each object
        delete obj.status;
        delete obj.productId1;
        delete obj.productId;
        delete obj.price;
        delete obj.note;
        delete obj.itemsId;
        delete obj.isClosed;
        delete obj.imageName;
        delete obj.cartId1;
        obj.date = newDate;
        return obj;
      });

      console.log('newArray: ', newArray);
      newArray.forEach((obj) => {
        this.cartsService.sendOrderDetailsToDB(obj);
        this.router.navigateByUrl('/sucssesmsg');
      });
    } catch (err: any) {
      //   this.notify.error(err);
    }
  }

  async deleteThisCard(arr: string[]) {
    try {
      console.log('arr: ', arr);

      let dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
        data: { action: 'remove' },
      });
      dialogRef.afterClosed().subscribe(async (result) => {
        if (result === false || result === undefined) return;
        await this.cartsService.deleteProduct(arr[0], arr[1]);
        // this.notify.success('Item has been deleted');
      });
    } catch (err: any) {
      //   this.notify.error(err);
    }
  }

  async deleteAllItems() {
    try {
      if (this.allItemsByCart.length === 0) return;

      let dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
        data: { action: 'removeAll' },
      });

      dialogRef.afterClosed().subscribe(async (result) => {
        if (result === false || result === undefined) return;

        await this.cartsService.deleteAllItemsByCart(
          this.allItemsByCart[0].cartId
        );
        // this.notify.success('All items in your cart have been deleted!');
      });
    } catch (err: any) {
      //   this.notify.error(err);
    }
  }

  async addProduct(product: any) {
    // if (product.productId === 8) {
    //   let dialogRef = this.dialog.open(ProductDialogComponentAvokado);
    //   dialogRef.afterClosed().subscribe(async (quantity) => {
    //     if (!quantity) return;
    //     try {
    //       const total = quantity * product.price;
    //       console.log('total: ', total);

    //       //object oriented thinking:
    //       const itemToBeAddedToCart = new CartItemModel(
    //         quantity,
    //         product.productId,
    //         store.getState().cartsState.currentCart?._id,
    //         total
    //       );

    //       await this.cartsService.addItem(
    //         itemToBeAddedToCart,
    //         store.getState().authState.user.userId
    //       );

    //       const cart = await this.cartsService.getCartByUser(
    //         store.getState().authState.user.userId
    //       );
    //       await this.cartsService.getAllItemsByCart(cart?.cartId);
    //     } catch (err: any) {
    //       // this.notify.error(err);
    //     }
    //   });
    // }
    if (
      product.productId === 27 ||
      product.productId === 31 ||
      product.productId === 32 ||
      product.productId === 35 ||
      product.productId === 36 ||
      product.productId === 37 ||
      product.productId === 38 ||
      product.productId === 39 ||
      product.productId === 40 ||
      product.productId === 41 ||
      product.productId === 42 ||
      product.productId === 43 ||
      product.productId === 46 ||
      product.productId === 47 ||
      product.productId === 49 ||
      product.productId === 50 ||
      product.productId === 51 ||
      product.productId === 52
    ) {
      let dialogRef = this.dialog.open(ProductDialogNumbersComponent);
      dialogRef.afterClosed().subscribe(async (quantity) => {
        if (!quantity) return;
        try {
          const total = quantity * product.price;

          const itemToBeAddedToCart = new CartItemModel(
            quantity,
            product.productId,
            store.getState().cartsState.currentCart?._id,
            total
          );

          await this.cartsService.addItem(
            itemToBeAddedToCart,
            store.getState().authState.user.userId
          );

          // this.notify.success("Item's in cart have been updated");

          const cart = await this.cartsService.getCartByUser(
            store.getState().authState.user.userId
          );

          await this.cartsService.getAllItemsByCart(cart?.cartId);
        } catch (err: any) {
          // this.notify.error(err);
        }
      });
    } else {
      if (product.productId === 34) {
        let dialogRef = this.dialog.open(ProductDialogComponentAvokado);
        dialogRef.afterClosed().subscribe(async (quantity) => {
          if (!quantity) return;
          try {
            const total = quantity * product.price;

            const itemToBeAddedToCart = new CartItemModel(
              quantity,
              product.productId,
              store.getState().cartsState.currentCart?._id,
              total
            );

            await this.cartsService.addItem(
              itemToBeAddedToCart,
              store.getState().authState.user.userId
            );

            // this.notify.success("Item's in cart have been updated");

            const cart = await this.cartsService.getCartByUser(
              store.getState().authState.user.userId
            );

            await this.cartsService.getAllItemsByCart(cart?.cartId);
          } catch (err: any) {
            // this.notify.error(err);
          }
        });
      } else {
        const total = product.price;
        const itemToBeAddedToCart = new CartItemModel(
          1,
          product.productId,
          store.getState().cartsState.currentCart?._id,
          total
        );

        await this.cartsService.addItem(
          itemToBeAddedToCart,
          store.getState().authState.user.userId
        );
        const cart = await this.cartsService.getCartByUser(
          store.getState().authState.user.userId
        );
        await this.cartsService.getAllItemsByCart(cart?.cartId);
      }
    }
  }

  async deleteProduct(product: any) {
    //An action to do when closing dialog (updating the cart)
    try {
      console.log('deleteProductFromTheList(product): ', product);
      await this.cartsService.deleteProductFromTheList(product);
      //   this.notify.success("Item's have been delete");
    } catch (err: any) {
      //   this.notify.error(err);
    }
  }

  ngOnDestroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}
