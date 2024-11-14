import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../product.service';
import { ReviewService } from '../review.service';
import { OrderItemService } from '../order-item.service';
import { CommonModule } from '@angular/common';
import { OrderItem } from '../order-item';
import { UserService } from '../user.service';
import { Product } from '../product';
import { FormsModule } from '@angular/forms';
import { Review } from '../review';

@Component({
  selector: 'app-product-details',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  reviews: any[] = [];
  newReview = { username: '', rating: 1, comment: '', reviewDate: new Date() };
  showCartMessage = false;
  cartMessageTimeout: any;
  reviewError: string = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private reviewService: ReviewService,
    private orderItemService: OrderItemService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProductById(productId).subscribe({
        next: (product: Product) => {
          this.product = product;
          this.loadReviews(productId);
        },
        error: (err) => console.error('Error fetching product details:', err)
      });

      this.productService.getReviewsByProductId(productId).subscribe({
        next: (reviews) => this.reviews = reviews,
        error: (err) => console.error('Error fetching reviews:', err)
      });
      this.newReview.username = localStorage.getItem('username') || '';
    }
  }

  loadReviews(productId: string): void {
    this.productService.getReviewsByProductId(productId).subscribe(reviews => {
      this.reviews = reviews;
    });
  }

  addToCart(): void {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = cart.findIndex((item: any) => item.productId === this.product?.id);

    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += 1;
    } else {
      const orderItem: OrderItem = {
        id: '',
        orderId: '',
        productId: this.product?.id || '',
        productName: this.product?.name || '',
        price: this.product?.price || 0,
        quantity: 1
      };
      cart.push(orderItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Show success message
    this.showCartMessage = true;
    
    // Clear any existing timeout
    if (this.cartMessageTimeout) {
      clearTimeout(this.cartMessageTimeout);
    }
    
    // Hide message after 3 seconds
    this.cartMessageTimeout = setTimeout(() => {
      this.showCartMessage = false;
    }, 3000);
  }

  validateReview(): boolean {
    this.reviewError = '';
    
    if (!this.newReview.comment.trim()) {
      this.reviewError = 'Please write a review comment';
      return false;
    }

    if (this.newReview.rating < 1 || this.newReview.rating > 5) {
      this.reviewError = 'Rating must be between 1 and 5';
      return false;
    }

    return true;
  }

  submitReview(): void {
    if (!this.validateReview()) {
      return;
    }

    if (!this.product) {
      console.error('Product details are not loaded.');
      alert('Product details are not loaded.');
      return;
    }

    const username = localStorage.getItem('username') || '';

    if (!username) {
      alert('Username is not available. Please log in.');
      return;
    }

    const review: Review = {
      productId: this.product.id,
      userId: username,
      rating: this.newReview.rating,
      comment: this.newReview.comment,
      reviewDate: new Date()
    };

    this.reviewService.createReview(review).subscribe({
      next: (reviewResponse) => {
        this.reviews.push(reviewResponse);
        this.newReview = { username: '', rating: 1, comment: '', reviewDate: new Date() };
        alert('Review submitted successfully!');
      },
      error: (error) => {
        console.error('Failed to add review:', error);
        alert('Failed to add review: ' + error.message);
      }
    });
  }

  isLowStock() {
    return this.product && this.product.stockQuantity < 5;
  }

  signOut(): void {
    this.userService.signOut();
  }
}