import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CartItemModel } from '../models/cart-item.model';
import { ProductModel } from '../models/product.model';

import { CartModel } from '../models/cart.model';
import {
  deleteAllFromCartAction,
  deleteItemFromCartAction,
  fetchCartItemsAction,
  getActiveCartAction,
} from '../redux/carts-state';
import store from '../redux/store';

@Injectable({
  providedIn: 'root',
})
export class CartsService {
  constructor(private http: HttpClient) {}

  async getAllItemsByCart(cartId: any): Promise<CartItemModel[]> {
    console.log('cartId: ', cartId);

    if (cartId) {
      const itemsByCart = await firstValueFrom(
        this.http.get<any[]>(
          `${
            environment.apiPath
          }FoodService.asmx/GetAllItemsByCart?cartId=${cartId.toString()}`
        )
      );

      console.log('itemsByCart: ', itemsByCart);

      store.dispatch(fetchCartItemsAction(itemsByCart));
      return itemsByCart;
    }
    return [];
  }

  async sendOrderDetailsToDB(obj: any): Promise<any[]> {
    console.log('sendOrderDetailsToDBObj: ', obj);
    if (obj) {
      await firstValueFrom(
        this.http.get<any>(
          `${environment.apiPath}FoodService.asmx/insertPurchaseDetailsByUser?amount=${obj.amount}&date=${obj.date}&productname=${obj.productname}&quantity=${obj.quantity}&total=${obj.total}&userId=${obj.userId}`
        )
      );
      return [];
    }
    return [];
  }

  async addItem(item: CartItemModel, userId: number): Promise<any> {
    console.log('item: ', item);
    if (!item.cartId) {
      const addedCard = await firstValueFrom(
        this.http.get<any>(
          `${environment.apiPath}FoodService.asmx/addCart?userId=${userId}`
        )
      );

      const theCart = await firstValueFrom(
        this.http.get<any>(
          `${environment.apiPath}FoodService.asmx/GetOneCart?userId=${userId}`
        )
      );

      item.cartId = theCart[0].cartId;

      console.log('item.cartId: ', item.cartId);

      // insert item to db:
      await firstValueFrom(
        this.http.get<any>(
          `${environment.apiPath}FoodService.asmx/InsertOneitem?quantity=${item.quantity}&total=${item.total}&productId=${item.productId}&cartId=${item.cartId}`
        )
      );
    }

    if (item.cartId) {
      const exCart = await firstValueFrom(
        this.http.get<any>(
          `${environment.apiPath}FoodService.asmx/GetOneCart?userId=${userId}`
        )
      );

      const itemsByCart = await firstValueFrom(
        this.http.get<any[]>(
          `${
            environment.apiPath
          }FoodService.asmx/GetAllItemsByCart?cartId=${item.cartId.toString()}`
        )
      );

      console.log('itemsByCart: ', itemsByCart);

      store.dispatch(fetchCartItemsAction(itemsByCart));

      // updating the existhing cart:
      const addedItem2 = await firstValueFrom(
        this.http.get<any>(
          `${environment.apiPath}FoodService.asmx/UpDateItem?quantity=${item.quantity}&total=${item.total}&productId=${item.productId}&cartId=${item.cartId}`
        )
      );

      //get item by cartId and productId:
      const itemFound = await firstValueFrom(
        this.http.get<any>(
          `${environment.apiPath}FoodService.asmx/getOneitem?productId=${item.productId}&cartId=${item.cartId}`
        )
      );

      console.log('itemFound: ', itemFound);

      return itemFound[0];
    }
  }

  // delete one item
  async deleteProductFromTheList(product: any): Promise<void> {
    console.log('deleteProductFromTheList product: ', product);

    await firstValueFrom(
      this.http.get(
        `${environment.apiPath}FoodService.asmx/DeleteOne?productId=${product.productId}`
      )
    );
  }

  // delete one item
  async deleteProduct(productId: any, cartId: any): Promise<void> {
    console.log('productId: ', productId);
    console.log('cartId: ', cartId);

    await firstValueFrom(
      this.http.get(
        `${
          environment.apiPath
        }FoodService.asmx/deleteItemfromShoppingCart?productId=${productId.toString()}`
      )
    );
    store.dispatch(deleteItemFromCartAction(productId));
  }

  //delete all items
  async deleteAllItemsByCart(cartId: any): Promise<void> {
    await firstValueFrom(
      this.http.get(
        `${environment.apiPath}FoodService.asmx/DeleteAllItemFromCart?cartId=${cartId}`
      )
    );
    store.dispatch(deleteAllFromCartAction());
  }

  async getCartByUser(userId: number): Promise<any> {
    console.log('getCartByUser-userId: ', userId);

    const cartByUser = await firstValueFrom(
      this.http.get<any>(
        `${
          environment.apiPath
        }FoodService.asmx/GetCartByUser?userId=${userId.toString()}`
      )
    );

    console.log('cartByUser[0]: ', cartByUser[0]);
    if (userId !== 5555) {
      const userDetails = await firstValueFrom(
        this.http.get<any>(
          `${
            environment.apiPath
          }FoodService.asmx/getOneUser?userId=${userId.toString()}`
        )
      );
      cartByUser[0].user = userDetails[0];
      console.log('userDetails after all: ', userDetails);

      store.dispatch(getActiveCartAction(cartByUser[0]));
      return cartByUser[0];
    }
  }

  getTotalCartAmount() {
    // go over all the cart items, calculate the total amount of the cart
    const cartItems = store.getState().cartsState.cartItems;
    console.log('cartItems: ', cartItems);

    const total = cartItems.reduce((accumulator, currVal) => {
      console.log('accumulator: ', accumulator);
      console.log('currVal: ', currVal);

      return accumulator + currVal.quantity * currVal.price;
    }, 0);

    return total;
  }
}
