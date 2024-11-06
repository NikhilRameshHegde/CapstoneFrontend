// src/app/services/order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderItem } from './order-item';
import { Order } from './order';


@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:5004/api/orders';  // Adjust this URL to match your Order Service's endpoint

  constructor(private http: HttpClient) {}

  // Create a new order
  createOrder(order: Partial<Order>): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order);
  }

  // Fetch details of a specific order by ID
  getOrderById(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${orderId}`);
  }

  // Fetch all orders for a specific user by user ID
  getUserOrders(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/user/${userId}`);
  }

  // Update an existing order
  updateOrder(orderId: string, order: Order): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${orderId}`, order);
  }

  // Delete an order
  deleteOrder(orderId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${orderId}`);
  }

  // Fetch all order items for a specific order by order ID
  getOrderItemsByOrderId(orderId: string): Observable<OrderItem[]> {
    return this.http.get<OrderItem[]>(`${this.apiUrl}/order-items/${orderId}`);
  }

  // Update an existing order item
  updateOrderItem(orderItemId: string, orderItem: OrderItem): Observable<OrderItem> {
    return this.http.put<OrderItem>(`${this.apiUrl}/order-items/${orderItemId}`, orderItem);
  }

  // Delete an order item
  deleteOrderItem(orderItemId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/order-items/${orderItemId}`);
  }
}
