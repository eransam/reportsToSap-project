import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page-buttons',
  templateUrl: './home-page-buttons.component.html',
  styleUrls: ['./home-page-buttons.component.scss'],
})
export class HomePageButtonsComponent {
  constructor(private router: Router) {}

  navigateToPageUpLoadFile() {
    this.router.navigate(['/PurchaseDetailsReportsListComponent']);
  }

  navigateToPageKitchen() {
    this.router.navigate(['/foodRepComponent']);
  }

  navigateToPage3() {
    this.router.navigate(['/page3']);
  }
}
