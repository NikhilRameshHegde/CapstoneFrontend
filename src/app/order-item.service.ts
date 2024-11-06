import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { OrderItem } from './order-item';

@Injectable({
  providedIn: 'root'
})
export class OrderItemService {
  private apiUrl = 'http://localhost:5004/api/order-items';  // Adjust this URL based on your backend configuration

  constructor(private http: HttpClient) {}
  getOrderItemsByVendorId(vendorId: string): Observable<OrderItem[]> {
    return this.http.get<OrderItem[]>(`${this.apiUrl}/vendor/${vendorId}`);
  }

  // Create a new order item
  createOrderItem(orderItem: OrderItem): Observable<OrderItem> {
    return this.http.post<OrderItem>(this.apiUrl, orderItem).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error.message);
    return throwError('Something went wrong; please try again later.');
  }

  // Fetch details of a specific order item by ID
  getOrderItemById(orderItemId: string): Observable<OrderItem> {
    return this.http.get<OrderItem>(`${this.apiUrl}/${orderItemId}`);
  }

  // Fetch all order items for a specific order by order ID
  getOrderItemsByOrderId(orderId: string): Observable<OrderItem[]> {
    return this.http.get<OrderItem[]>(`${this.apiUrl}/order/${orderId}`);
  }

  // Fetch all order items for a specific product by product ID
  getOrderItemsByProductId(productId: string): Observable<OrderItem[]> {
    return this.http.get<OrderItem[]>(`${this.apiUrl}/product/${productId}`);
  }

  // Update an existing order item
  updateOrderItem(orderItemId: string, orderItem: OrderItem): Observable<OrderItem> {
    return this.http.put<OrderItem>(`${this.apiUrl}/${orderItemId}`, orderItem);
  }

  // Delete an order item
  deleteOrderItem(orderItemId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${orderItemId}`);
  }
}
