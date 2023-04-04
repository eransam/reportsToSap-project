import { ProductsService } from './../../../services/products.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NotifyService } from 'src/app/services/notify.service';
import { CartsService } from 'src/app/services/carts.service';
import store from 'src/app/redux/store';

@Component({
  selector: 'app-logout',
  template: '',
})
export class LogoutComponent implements OnInit {
  searchText: string;
  allItemsByCart: any[];

  constructor(
    private cartsService: CartsService,
    private authService: AuthService,
    private notify: NotifyService,
    private router: Router,
    private productsService: ProductsService
  ) {}

  async ngOnInit() {
    if (store.getState().authState.user.role === '1') {
      const cart = await this.cartsService.getCartByUser(
        store.getState().authState.user.userId
      );

      console.log('cart: ', cart);
      this.allItemsByCart = await this.cartsService.getAllItemsByCart(
        cart?.cartId
      );
    }
    this.productsService.setSelectedCategory('all');
    this.authService.logout();
    // this.notify.success('You are logged-out');
    this.router.navigateByUrl('/layoutcomponent');
  }

  async deleteAllItemsAuto() {
    try {
      console.log(
        'this.allItemsByCart[0].cartId: ',
        this.allItemsByCart[0].cartId
      );

      if (this.allItemsByCart.length === 0) return;
      await this.cartsService.deleteAllItemsByCart(
        this.allItemsByCart[0].cartId
      );
    } catch (err: any) {
    //   this.notify.error(err);
    }
  }

  ngOnDestroy(): void {
    this.deleteAllItemsAuto();
  }
}
