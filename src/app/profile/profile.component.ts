import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { OrderService } from '../order.service';
import { ReviewService } from '../review.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentAction: string = 'profile'; // Default action to display profile
  profileForm: FormGroup;
  orders: any[] = []; // Array to store user's orders
  reviews: any[] = []; // Array to store user's reviews
  userId: string | null = localStorage.getItem('userId'); // Retrieve userId from localStorage
  userEmail: string = ''; // Store the logged-in user's email
  isEditingProfile: boolean = false; // Control editing state

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private orderService: OrderService,
    private reviewService: ReviewService,
    private productService: ProductService
  ) {
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      email: [{ value: '', disabled: true }, Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      password: ['', Validators.minLength(8)] // Password field with a minimum length
    });
  }

  ngOnInit(): void {
    // Ensure userEmail is correctly retrieved before loading the profile
    this.userEmail = localStorage.getItem('userEmail') || '';
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe({
        next: (profile) => {
          console.log('Profile data:', profile); // Log the profile data
          this.userId = profile.id || this.userId; // Store the user's ID for fetching orders/reviews
          this.profileForm.patchValue({
            username: profile.username,
            email: profile.email,
            phone: profile.phone,
            address: profile.address,
            password: '' // Leave the password field empty initially
          });
        },
        error: (error) => console.error('Failed to load user profile', error)
      });
    } else {
      console.error('No user ID found');
    }
  }

  enableProfileEdit(): void {
    this.isEditingProfile = true; // Enable editing mode
    this.profileForm.get('email')?.enable(); // Enable the email field for editing
  }

  cancelProfileEdit(): void {
    this.isEditingProfile = false; // Cancel editing mode
    this.loadUserProfile(); // Reset form to original values
  }

  onProfileSubmit(): void {
    if (this.profileForm.valid) {
      this.userService.updateUserProfile(this.userEmail, this.profileForm.value).subscribe({
        next: () => {
          alert('Profile updated successfully');
          this.isEditingProfile = false; // Exit editing mode
        },
        error: (error) => console.error('Failed to update profile', error)
      });
    }
  }

  viewProfile(): void {
    this.currentAction = 'profile';
  }

  viewOrders(): void {
    if (this.userId) {
      this.currentAction = 'orders';
      console.log(this.userId);
      this.userService.getUserOrders(this.userId).subscribe({
        next: (orders) => {
          // Load orders and fetch product details
          this.orders = orders.map(order => ({
            ...order,
            orderDate: new Date(order.orderDate),  // Convert date string to Date object if necessary
            total: order.total || this.calculateTotal(order.orderItems), // Calculate total if missing
            orderItems: order.orderItems.map((item: any) => ({
              ...item,
              productImage: '',
              productName: ''
            }))
          }));
          this.orders.forEach(order => {
            order.orderItems.forEach((item: { productId: string; productImage: string; productName: string; }) => {
              this.productService.getProductById(item.productId).subscribe({
                next: (product) => {
                  item.productImage = product.imageUrl;
                  item.productName = product.name;
                },
                error: (error) => {
                  console.error('Failed to fetch product details', error);
                  item.productImage = 'default-image-url'; // Set default image on error
                  item.productName = 'Unknown Product'; // Set default name on error
                }
              });
            });
          });
        },
        error: (error) => console.error('Failed to load orders', error)
      });
    } else {
      console.error('No user ID found');
    }
  }

  calculateTotal(orderItems: any[]): number {
    return orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  signOut(): void {
    this.userService.signOut();
    // Logic to redirect to login page
  }
}
