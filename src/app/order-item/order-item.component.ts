import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, RouterLink } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { OrderService } from '../order.service';
import { ProductService } from '../product.service';
import { OrderItem } from '../order-item';
import { Product } from '../product';

@Component({
  selector: 'app-order-item',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.css']
})
export class OrderItemComponent implements OnInit {
  orderItems: OrderItem[] = [];
  totalAmount: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private sanitizer: DomSanitizer,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadOrderItems();
  }

  // Sanitize URLs to prevent XSS
  getSafeUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  // Load order items from local storage and populate additional product details
  loadOrderItems(): void {
    let loadedItems = JSON.parse(localStorage.getItem('cart') || '[]');
    loadedItems.forEach((item: OrderItem) => {
      this.productService.getProductById(item.productId).subscribe(product => {
        this.orderItems.push({
          ...item,
          productName: product.name,
          price: product.price,
          // Don't store `productImage` in `OrderItem`, just use it directly in the component
          productImage: product.imageUrl
        });
        this.calculateTotalAmount();
      });
    });
  }
  
  // Calculate total amount for the order
  calculateTotalAmount(): void {
    this.totalAmount = this.orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  // Increase the quantity of an item in the cart
  increaseQuantity(index: number): void {
    this.orderItems[index].quantity++;
    this.updateCart();
  }

  // Decrease the quantity of an item in the cart
  decreaseQuantity(index: number): void {
    if (this.orderItems[index].quantity > 1) {
      this.orderItems[index].quantity--;
    } else {
      this.orderItems.splice(index, 1);
    }
    this.updateCart();
  }

  // Update the cart in local storage
  updateCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.orderItems));
    this.calculateTotalAmount();
  }

  // Place the order and send only required data
  placeOrder(): void {
    const orderData = {
      userId: localStorage.getItem('userId') || 'defaultUserId',
      orderItems: this.orderItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price // Include the price
      }))
    };
  
    this.orderService.createOrder(orderData).subscribe({
      next: () => {
        console.log('Order placed successfully');
        alert("Order placed successfully");
        localStorage.removeItem('cart');
        this.router.navigate(['/home']);  // Adjust according to the desired destination
      },
      error: err => {
        alert('An error occurred. Please try again.');
      }
    });
  }
  
}
