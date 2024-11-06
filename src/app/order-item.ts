export class OrderItem {
  id?: string;
  orderId!: string;
  productId!: string;
  productName!: string;
  price!: number;
  quantity!: number;
  productImage?: string;  // Add this property

  constructor(
    orderId: string,
    productId: string,
    productName: string,
    price: number,
    quantity: number,
    productImage?: string // Update the constructor
  ) {
    this.orderId = orderId;
    this.productId = productId;
    this.productName = productName;
    this.price = price;
    this.quantity = quantity;
    this.productImage = productImage;  // Set the productImage
  }
}
