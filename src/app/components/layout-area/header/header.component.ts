import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Unsubscribe } from 'redux';
import { UserModel } from 'src/app/models/user.model';
import store from 'src/app/redux/store';
import { ReportService } from 'src/app/services/reports.service';
import { ProductsService } from 'src/app/services/products.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  user: UserModel;
  unsubscribe: Unsubscribe;
  searchText: string;

  constructor(
    public router: Router,
    private reportService: ReportService,
    private productsService: ProductsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.user = store.getState().authState.user;
    this.unsubscribe = store.subscribe(() => {
      this.user = store.getState().authState.user;
      this.searchText = store.getState().productsState.searchText;
    });

    console.log('this.user: ', this.user);
  }
  showRep() {
    this.router.navigateByUrl('/PurchaseDetailsReportsListComponent');
  }

  test() {
    console.log('the-testo');
  }

  ngOnDestroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}
