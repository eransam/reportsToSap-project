import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Unsubscribe } from 'redux';
import { UserModel } from 'src/app/models/user.model';
import store from 'src/app/redux/store';

@Component({
  selector: 'app-auth-menu',
  templateUrl: './auth-menu.component.html',
  styleUrls: ['./auth-menu.component.scss'],
})
export class AuthMenuComponent implements OnInit, OnDestroy {
  user: any = [];
  unsubscribe: Unsubscribe;
  constructor(private router: Router) {}

  ngOnInit() {
    this.user = store.getState().authState.user;
    console.log('this.user: ', this.user);
    console.log(
      'store.getState().authState.user: ',
      store.getState().authState.user
    );
    console.log(
        'store.getState().authState.user: ',
        store.getState().productsState.searchText
      );

    this.unsubscribe = store.subscribe(() => {
      this.user = store.getState().authState.user;
    });
  }

  async theLogOut() {
    this.user = null;
    this.router.navigateByUrl('/logout');
  }

  ngOnDestroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}
