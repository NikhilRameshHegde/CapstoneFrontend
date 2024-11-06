import { Component, Inject, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { VendorService } from '../vendor.service';
import { Router } from '@angular/router';

declare var google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  role: string = '';
  email: string = '';
  password: string = '';
  token: string='';
  loginFailed: boolean = false;

  constructor(
    private userService: UserService,
    private vendorService: VendorService,
    private renderer: Renderer2,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.password = '';

    if (isPlatformBrowser(this.platformId)) {
      this.loadGoogleScript();
    }
  }
 
  onLogin() {
    if (this.role === 'User') {
      this.userService.loginUser(this.email, this.password).subscribe({
        next: (response: any) => {  // Type your response appropriately if known
          console.log('User login successful:', response);
          this.loginFailed = false;
          localStorage.setItem('token', response.token); // Store JWT token
          localStorage.setItem('role', 'User');
          localStorage.setItem('userId', response.user.id); // Access user ID from the user object
          localStorage.setItem('username', response.user.username); // Store username
          localStorage.setItem('userEmail', response.user.email); // Store email
          localStorage.setItem('userPhone', response.user.phone); // Store phone
          localStorage.setItem('userAddress', response.user.address); // Store address
          this.router.navigate(['/home']); // Navigate to home upon successful login
        },
        error: (error) => {
          console.error('User login failed:', error);
          this.loginFailed = true;
        }
      });
    } else if (this.role === 'Vendor') {
      this.vendorService.loginVendor(this.email, this.password).subscribe({
        next: (response: any) => {  // Type your response appropriately if known
          console.log('Vendor login successful:', response);
          this.loginFailed = false;
          localStorage.setItem('token', 'thisa'); // Store JWT token
          localStorage.setItem('role', 'Vendor');
          localStorage.setItem('vendorId', response.vendor.id); // Access vendor ID from the user object
          localStorage.setItem('vendorName', response.username); // Assuming username is used for the vendor name
          localStorage.setItem('vendorEmail', response.email); // Store email
          this.router.navigate(['/vendor-home']); // Navigate to vendor dashboard upon successful login
        },
        error: (error) => {
          console.error('Vendor login failed:', error);
          this.loginFailed = true;
        }
      });
    } else {
      console.error('Role not selected or invalid role.');
      this.loginFailed = true;
    }
  }
  
  

  loadGoogleScript() {
    const script = this.renderer.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => this.initializeGoogleSignIn();
    script.onerror = () => console.error('Google API script could not be loaded.');
    this.renderer.appendChild(document.body, script);
  }

  initializeGoogleSignIn() {
    google.accounts.id.initialize({
      client_id: 'YOUR_GOOGLE_CLIENT_ID',
      callback: (response: any) => this.handleGoogleSignIn(response)
    });
    
    google.accounts.id.renderButton(
      document.getElementById('googleBtn'),
      { theme: 'outline', size: 'large' }
    );
    
    google.accounts.id.prompt();
  }

  handleGoogleSignIn(response: any) {
    console.log('Google Sign-In response:', response);
    this.loginFailed = false;
    alert('Google Login Successful.');
  }
}
