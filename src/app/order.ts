// src/app/models/order.ts
import { OrderItem } from './order-item';

export class Order {
  id?: string; // Unique identifier for the order
  userId: string;
  orderDate: Date;
  totalAmount: number;
  orderItems: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  constructor(
    id: string,
    userId: string,
    orderDate: Date,
    totalAmount: number,
    orderItems: OrderItem[]
  ) {
    this.id = id;
    this.userId = userId;
    this.orderDate = orderDate;
    this.totalAmount = totalAmount;
    this.orderItems = orderItems;
  }
}
