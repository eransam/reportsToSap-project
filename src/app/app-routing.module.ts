import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminHomeComponent } from './components/admins-area/admin-home/admin-home.component';
import { UpdateProductComponent } from './components/admins-area/update-product/update-product.component';
import { LogoutComponent } from './components/auth-area/logout/logout.component';
import { RegisterBothStepsComponent } from './components/auth-area/register-both-steps/register-both-steps.component';
import { HomeComponent } from './components/home-area/home/home.component';
import { PageNotFoundComponent } from './components/layout-area/page-not-found/page-not-found.component';
import { OrderComponent } from './components/orders-area/order/order.component';
import { ShoppingComponent } from './components/shopping-area/shopping/shopping.component';
import { AdminGuard } from './services/admin.guard';
import { AuthGuard } from './services/auth.guard';
import { HomeGuard } from './services/home.guard';
import { SucssesMsgComponent } from './components/sucsses-msg/sucsses-msg.component';
import { PurchaseDetailsComponent } from './components/purchase-details-reports-card/purchase-details-reports-card/purchase-details.component';
import { EmailComponent } from './email/email.component';
import { SearchReportsComponent } from './search-reports/search-reports.component';
import { PurchaseDetailsReportsListComponent } from './components/purchase-details-reports-card/purchase-details-reports-list/purchase-details-reports-list.component';
import { LayoutComponent } from './components/layout-area/layout/layout.component';

const routes: Routes = [
  { path: 'register', component: RegisterBothStepsComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'emailcomponent', component: EmailComponent },

  { path: 'sucssesmsg', component: SucssesMsgComponent },
  { path: 'home', component: HomeComponent },
  { path: 'layoutcomponent', component: LayoutComponent },

  { path: 'purchasedetailscomponent', component: PurchaseDetailsComponent },
  { path: 'SearchReportsComponent', component: SearchReportsComponent },

  { path: 'shopping', component: ShoppingComponent },
  {
    path: 'PurchaseDetailsReportsListComponent',
    component: PurchaseDetailsReportsListComponent,
  },

  {
    path: 'admin-home',
    component: AdminHomeComponent,
  },
  {
    path: 'admin/edit/:id',
    component: UpdateProductComponent,
  },

  { path: 'order', component: OrderComponent },

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
