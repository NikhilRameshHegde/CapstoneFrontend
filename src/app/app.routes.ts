import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { HomeComponent } from './home/home.component';
import { ProductListComponent } from './product-list/product-list.component';
import { VendorComponent } from './vendor/vendor.component';
import { AuthGuard } from './auth.guard';
import { LandingComponent } from './landing/landing.component';
import { ProfileComponent } from './profile/profile.component';
import { OrderItemComponent } from './order-item/order-item.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { VendorListComponent } from './vendor-list/vendor-list.component';
import { VendorHomeComponent } from './vendor-home/vendor-home.component';
import { VendorProfileComponent } from './vendor-profile/vendor-profile.component';


export const routes: Routes = [
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
  { path: 'landing', component: LandingComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard], data: { expectedRole: 'User' } },
  { path: 'vendor', component: VendorComponent, canActivate: [AuthGuard], data: { expectedRole: 'Vendor' } },
  { path: 'products/:categoryId', component: ProductListComponent, canActivate: [AuthGuard], data: { expectedRole: 'User' } },
  { path: 'vendors/:vendorId', component: VendorListComponent, canActivate: [AuthGuard], data: { expectedRole: 'User' } },
  { path:'vendor-home', component:VendorHomeComponent,canActivate:[AuthGuard],data:{expectedRole:'Vendor'}},
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard], data: { expectedRole: 'User' } },
  { path: 'vendor-profile', component: VendorProfileComponent, canActivate: [AuthGuard], data: { expectedRole: 'Vendor' } },

  { path: 'order-item', component: OrderItemComponent, canActivate: [AuthGuard], data: { expectedRole: 'User' } },
  { path: 'productsdetails/:id', component: ProductDetailsComponent ,canActivate: [AuthGuard], data: { expectedRole: 'User' } }, // Route for product details

  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: '**', redirectTo: '/landing' },
];

@NgModule({
  imports: [    RouterModule.forRoot(routes, { anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })
],
  exports: [RouterModule]
})
export class AppRoutingModule {}




