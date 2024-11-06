import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { VendorService } from '../vendor.service';
import { User } from '../user';
import { Vendor } from '../vendor';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone:true,
  imports:[CommonModule,FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  role: string = '';  // Track the selected role
  confirmPassword: string = '';
  passwordMismatch: boolean = false;
  emailAlreadyRegistered: boolean = false;  // Handle email registration check
  isCheckingEmail: boolean = false;  // Show loader/disable button while checking

  // User data
  formData: User = {
    username: '',
    password: '',
    email: '',
    phone: '',
    address: ''
  };

  // Vendor-specific data
  vendorData: Vendor = {
    name: '',
    description: '',
    contactMail: '',
    contactPhone: '',
    website: '',
    city: '',
    password: '',
    gstno: ''
  };

  constructor(
    private userService: UserService,
    private vendorService: VendorService,
    private router: Router
  ) {}

  onRoleChange() {
    if (this.role === 'Vendor') {
      this.formData = { username: '', password: '', email: '', phone: '', address: '' };
    } else if (this.role === 'User') {
      this.vendorData = { name: '', description: '', contactMail: '', contactPhone: '', website: '', city: '', password: '', gstno: '' };
    }
  }

  onSignup(form: NgForm) {
    if (this.role === 'User' && this.formData.password !== this.confirmPassword ||
        this.role === 'Vendor' && this.vendorData.password !== this.confirmPassword) {
      this.passwordMismatch = true;
      return;  // Prevent form submission if passwords do not match
    }

    this.passwordMismatch = false;
    this.isCheckingEmail = true;  // Start checking email

    if (this.role === 'User') {
      // Check if user email is already registered
      this.userService.getUserByEmail(this.formData.email).subscribe({
        next: (existingUser) => {
          if (existingUser) {
            this.emailAlreadyRegistered = true;  // Show error if user exists
            this.isCheckingEmail = false;  // Stop the loader
          } else {
            this.registerUser();  // Proceed with user registration
          }
        },
        error: () => this.registerUser()  // Handle error case (no user found)
      });
    } else if (this.role === 'Vendor') {
      // Check if vendor email is already registered
      this.vendorService.getVendorByContactMail(this.vendorData.contactMail).subscribe({
        next: (existingVendor) => {
          if (existingVendor) {
            this.emailAlreadyRegistered = true;  // Show error if vendor exists
            this.isCheckingEmail = false;  // Stop the loader
          } else {
            this.registerVendor();  // Proceed with vendor registration
          }
        },
        error: () => this.registerVendor()  // Handle error case (no vendor found)
      });
    }
  }

  registerUser() {
    this.userService.registerUser(this.formData).subscribe({
      next: (response) => {
        console.log('User registered successfully:', response);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error registering user:', error);
        this.isCheckingEmail = false;
      }
    });
  }

  registerVendor() {
    this.vendorService.registerVendor(this.vendorData).subscribe({
      next: (response) => {
        console.log('Vendor registered successfully:', response);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error registering vendor:', error);
        this.isCheckingEmail = false;
      }
    });
  }
}
