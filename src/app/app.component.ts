import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import {ChangePasswordComponent} from './change-password/change-password.component'
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { ProductListComponent } from './product-list/product-list.component';
import { VendorComponent } from './vendor/vendor.component';
import { LandingComponent } from './landing/landing.component';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderItemComponent } from './order-item/order-item.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    SignupComponent,
    LoginComponent,
    ChangePasswordComponent,RouterModule,

    ForgotPasswordComponent,CommonModule,HttpClientModule,HomeComponent,ProductListComponent,VendorComponent,LandingComponent,OrderItemComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'final-app';
}
