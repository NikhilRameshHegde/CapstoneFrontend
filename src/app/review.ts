export class Review {
    id?: string;
    productId: string;
    userId: string;
    rating: number;
    comment: string;
    reviewDate?: Date;
  
    constructor(id: string, productId: string, userId: string, rating: number, comment: string, reviewDate: Date) {
      this.id = id;
      this.productId = productId;
      this.userId = userId;
      this.rating = rating;
      this.comment = comment;
      this.reviewDate = reviewDate;
    }
  }
  