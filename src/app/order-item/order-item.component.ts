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
  isCartEmpty: boolean = true;

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

  getSafeUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  loadOrderItems(): void {
    let loadedItems = JSON.parse(localStorage.getItem('cart') || '[]');
    if (loadedItems.length === 0) {
      this.isCartEmpty = true;
      return;
    }

    this.isCartEmpty = false;
    loadedItems.forEach((item: OrderItem) => {
      this.productService.getProductById(item.productId).subscribe(product => {
        this.orderItems.push({
          ...item,
          productName: product.name,
          price: product.price,
          productImage: product.imageUrl
        });
        this.calculateTotalAmount();
      });
    });
  }
  
  calculateTotalAmount(): void {
    this.totalAmount = this.orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  increaseQuantity(index: number): void {
    this.orderItems[index].quantity++;
    this.updateCart();
  }

  decreaseQuantity(index: number): void {
    if (this.orderItems[index].quantity > 1) {
      this.orderItems[index].quantity--;
    } else {
      this.orderItems.splice(index, 1);
      if (this.orderItems.length === 0) {
        this.isCartEmpty = true;
      }
    }
    this.updateCart();
  }

  updateCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.orderItems));
    this.calculateTotalAmount();
  }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }

  placeOrder(): void {
    if (this.isCartEmpty) {
      alert('Please add items to your cart before placing an order.');
      return;
    }

    const orderData = {
      userId: localStorage.getItem('userId') || 'defaultUserId',
      orderItems: this.orderItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      }))
    };
  
    this.orderService.createOrder(orderData).subscribe({
      next: () => {
        console.log('Order placed successfully');
        alert("Order placed successfully");
        localStorage.removeItem('cart');
        this.router.navigate(['/home']);
      },
      error: err => {
        alert('An error occurred. Please try again.');
      }
    });
  }
}