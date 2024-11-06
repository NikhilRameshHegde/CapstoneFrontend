import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { VendorService } from '../vendor.service';
import { OrderService } from '../order.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../product.service';
import { OrderItemService } from '../order-item.service';

@Component({
  selector: 'app-vendor-profile',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './vendor-profile.component.html',
  styleUrls: ['./vendor-profile.component.css']
})
export class VendorProfileComponent implements OnInit {
  currentAction: string = 'profile'; // Default action to display profile
  profileForm: FormGroup;
  orders: any[] = []; // Array to store vendor's orders
  vendorId: string | null = localStorage.getItem('vendorId'); // Retrieve vendorId from localStorage
  isEditingProfile: boolean = false; // Control editing state

  constructor(
    private fb: FormBuilder,
    private vendorService: VendorService,
    private orderService: OrderService,
    private productService: ProductService,
    private orderItemService:OrderItemService
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      contactMail: [{ value: '', disabled: true }, Validators.required],
      contactPhone: ['', Validators.required],
      website: ['', Validators.required],
      city: ['', Validators.required],
      gstno: ['', Validators.required],
      password: ['', Validators.minLength(8)] // Password field with a minimum length
    });
  }

  ngOnInit(): void {
    this.loadVendorProfile();
  }

  loadVendorProfile(): void {
    if (this.vendorId) {
      this.vendorService.getVendorById(this.vendorId).subscribe({
        next: (profile) => {
          if (profile) {
            console.log('Vendor Profile data:', profile);
            this.vendorId = profile.id || this.vendorId;
            this.profileForm.patchValue({
              name: profile?.name || '', // Use optional chaining or a default value
              description: profile?.description || '',
              contactMail: profile?.contactMail || '',
              contactPhone: profile?.contactPhone || '',
              website: profile?.website || '',
              city: profile?.city || '',
              gstno: profile?.gstno || '',
              password: '' // Leave the password field empty initially
            });
          } else {
            console.error('No profile found');
          }
        },
        error: (error) => console.error('Failed to load vendor profile', error)
      });
    } else {
      console.error('No vendor ID found');
    }
  }
  
  enableProfileEdit(): void {
    this.isEditingProfile = true;
    this.profileForm.get('contactMail')?.enable();
  }

  cancelProfileEdit(): void {
    this.isEditingProfile = false;
    this.loadVendorProfile();
  }

  onProfileSubmit(): void {
    if (this.profileForm.valid) {
      const updatedVendor = {
        ...this.profileForm.value,
        id: this.vendorId // Include vendorId in the object
      };
  
      this.vendorService.updateVendor(updatedVendor).subscribe({
        next: () => {
          alert('Profile updated successfully');
          this.isEditingProfile = false;
        },
        error: (error) => console.error('Failed to update profile', error)
      });
    }
  }
  

  viewProfile(): void {
    this.currentAction = 'profile';
  }

  viewOrders(): void {
    if (this.vendorId) {
      this.currentAction = 'orders';
      this.orderItemService.getOrderItemsByVendorId(this.vendorId).subscribe({
        next: (orderItems) => {
          // Process the order items to include product details
          this.orders = orderItems.map(item => ({
            ...item,
            productImage: '',
            productName: ''
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
                  item.productImage = 'default-image-url';
                  item.productName = 'Unknown Product';
                }
              });
            });
          });
        },
        error: (error) => console.error('Failed to load orders', error)
      });
    } else {
      console.error('No vendor ID found');
    }
  }
  

  calculateTotal(orderItems: any[]): number {
    return orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  signOut(): void {
    this.vendorService.signOut();
  }
}
